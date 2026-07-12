#![no_std]

//! Bagibagi campaign vault.
//! One contract manages many campaigns. Donors pay into the contract, donation
//! amounts are split immediately into beneficiary balance and organizer
//! allowance escrow, and the allowance can only be released after proof upload.

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, BytesN, Env,
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    NextId,
    Campaign(u32),
    DonorTotal(u32, Address),
    Tier(Address),
    Proof(u32),
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Campaign {
    pub organizer: Address,
    pub beneficiary: Address,
    pub allowance_bps: u32,
    pub tier: u32,
    pub raised: i128,
    pub beneficiary_available: i128,
    pub allowance_escrow: i128,
    pub proof_uploaded: bool,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InvalidAmount = 3,
    InvalidAllowance = 4,
    TierTooLow = 5,
    CampaignNotFound = 6,
    Unauthorized = 7,
    InsufficientBalance = 8,
    ProofMissing = 9,
    InvalidTier = 10,
}

#[contract]
pub struct BagibagiCampaign;

#[contractimpl]
impl BagibagiCampaign {
    pub fn initialize(env: Env, admin: Address, token: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::NextId, &1u32);
        Ok(())
    }

    pub fn set_tier(env: Env, organizer: Address, tier: u32) -> Result<(), Error> {
        require_admin(&env)?;
        if tier > 2 {
            return Err(Error::InvalidTier);
        }
        env.storage()
            .persistent()
            .set(&DataKey::Tier(organizer.clone()), &tier);
        env.events()
            .publish((symbol_short!("tier"), organizer), tier);
        Ok(())
    }

    pub fn create_campaign(
        env: Env,
        organizer: Address,
        beneficiary: Address,
        allowance_bps: u32,
    ) -> Result<u32, Error> {
        organizer.require_auth();
        if allowance_bps > 1_000 {
            return Err(Error::InvalidAllowance);
        }
        let tier = Self::tier_of(env.clone(), organizer.clone());
        if allowance_bps > tier_ceiling_bps(tier) {
            return Err(Error::TierTooLow);
        }

        let id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NextId)
            .ok_or(Error::NotInitialized)?;
        let next = id + 1;
        env.storage().instance().set(&DataKey::NextId, &next);

        let campaign = Campaign {
            organizer: organizer.clone(),
            beneficiary,
            allowance_bps,
            tier,
            raised: 0,
            beneficiary_available: 0,
            allowance_escrow: 0,
            proof_uploaded: false,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(id), &campaign);
        env.events()
            .publish((symbol_short!("campaign"), organizer), id);
        Ok(id)
    }

    pub fn donate(env: Env, donor: Address, campaign_id: u32, amount: i128) -> Result<(), Error> {
        donor.require_auth();
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let token_id: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .ok_or(Error::NotInitialized)?;
        let mut campaign = get_campaign(&env, campaign_id)?;
        token::Client::new(&env, &token_id).transfer(
            &donor,
            &env.current_contract_address(),
            &amount,
        );

        let allowance = (amount * campaign.allowance_bps as i128) / 10_000;
        let beneficiary_amount = amount - allowance;
        campaign.raised += amount;
        campaign.beneficiary_available += beneficiary_amount;
        campaign.allowance_escrow += allowance;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        let donor_key = DataKey::DonorTotal(campaign_id, donor.clone());
        let prev: i128 = env.storage().persistent().get(&donor_key).unwrap_or(0);
        env.storage().persistent().set(&donor_key, &(prev + amount));
        env.events()
            .publish((symbol_short!("donate"), campaign_id, donor), amount);
        Ok(())
    }

    pub fn withdraw_beneficiary(
        env: Env,
        campaign_id: u32,
        beneficiary: Address,
        amount: i128,
    ) -> Result<(), Error> {
        beneficiary.require_auth();
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }
        let mut campaign = get_campaign(&env, campaign_id)?;
        if campaign.beneficiary != beneficiary {
            return Err(Error::Unauthorized);
        }
        if amount > campaign.beneficiary_available {
            return Err(Error::InsufficientBalance);
        }

        let token_id: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .ok_or(Error::NotInitialized)?;
        campaign.beneficiary_available -= amount;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        token::Client::new(&env, &token_id).transfer(
            &env.current_contract_address(),
            &beneficiary,
            &amount,
        );
        env.events()
            .publish((symbol_short!("benefit"), campaign_id, beneficiary), amount);
        Ok(())
    }

    pub fn upload_proof(
        env: Env,
        campaign_id: u32,
        organizer: Address,
        proof_hash: BytesN<32>,
    ) -> Result<(), Error> {
        organizer.require_auth();
        let mut campaign = get_campaign(&env, campaign_id)?;
        if campaign.organizer != organizer {
            return Err(Error::Unauthorized);
        }
        campaign.proof_uploaded = true;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        env.storage()
            .persistent()
            .set(&DataKey::Proof(campaign_id), &proof_hash);
        env.events()
            .publish((symbol_short!("proof"), campaign_id, organizer), proof_hash);
        Ok(())
    }

    pub fn release_allowance(env: Env, campaign_id: u32, amount: i128) -> Result<(), Error> {
        require_admin(&env)?;
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }
        let mut campaign = get_campaign(&env, campaign_id)?;
        if !campaign.proof_uploaded {
            return Err(Error::ProofMissing);
        }
        if amount > campaign.allowance_escrow {
            return Err(Error::InsufficientBalance);
        }

        let token_id: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .ok_or(Error::NotInitialized)?;
        campaign.allowance_escrow -= amount;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        token::Client::new(&env, &token_id).transfer(
            &env.current_contract_address(),
            &campaign.organizer,
            &amount,
        );
        env.events().publish(
            (symbol_short!("allowance"), campaign_id, campaign.organizer),
            amount,
        );
        Ok(())
    }

    pub fn campaign(env: Env, campaign_id: u32) -> Result<Campaign, Error> {
        get_campaign(&env, campaign_id)
    }

    pub fn donor_total(env: Env, campaign_id: u32, donor: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::DonorTotal(campaign_id, donor))
            .unwrap_or(0)
    }

    pub fn tier_of(env: Env, organizer: Address) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::Tier(organizer))
            .unwrap_or(0)
    }

    pub fn proof_hash(env: Env, campaign_id: u32) -> Result<BytesN<32>, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Proof(campaign_id))
            .ok_or(Error::ProofMissing)
    }
}

fn get_campaign(env: &Env, campaign_id: u32) -> Result<Campaign, Error> {
    env.storage()
        .persistent()
        .get(&DataKey::Campaign(campaign_id))
        .ok_or(Error::CampaignNotFound)
}

fn require_admin(env: &Env) -> Result<Address, Error> {
    let admin: Address = env
        .storage()
        .instance()
        .get(&DataKey::Admin)
        .ok_or(Error::NotInitialized)?;
    admin.require_auth();
    Ok(admin)
}

fn tier_ceiling_bps(tier: u32) -> u32 {
    match tier {
        0 => 0,
        1 => 500,
        _ => 1_000,
    }
}

mod test;
