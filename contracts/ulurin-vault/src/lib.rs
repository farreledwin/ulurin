#![no_std]

//! Ulurin vault.
//!
//! One contract, many campaigns. A donation is split the moment it lands:
//! beneficiary balance, creator reward escrow, platform fee accrual.
//!
//! The rule this contract exists to enforce:
//!
//!   PP No. 29/1980 Pasal 6(1) — "Pembiayaan usaha pengumpulan sumbangan
//!   sebanyak-banyaknya 10% (sepuluh persen) dari hasil pengumpulan sumbangan
//!   yang bersangkutan."
//!
//! Total financing of a campaign = creator reward + platform fee. Both are
//! checked against MAX_TOTAL_BPS when the campaign is opened, so an
//! over-cap campaign cannot be created at all. The limit fails before the
//! violation instead of being discovered in an audit years later.
//!
//! What this contract deliberately does NOT do: it does not prove how money was
//! spent. It proves the flow (collected, split, disbursed) and gates the
//! creator's reward on a proof hash existing. Verifying the proof itself is
//! human work that happens off-chain.

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, token, Address, BytesN, Env,
};

/// PP No. 29/1980 Pasal 6(1). Creator reward + platform fee may never exceed
/// this share of a campaign's proceeds. Not a config value: a config value can
/// be raised quietly, and the whole point is that it cannot.
pub const MAX_TOTAL_BPS: u32 = 1_000;

/// Verification tier caps what the creator may take. The ladder is the reason a
/// donor can read a percentage and know what stands behind it.
/// Tier 0 (no KYC) 0% · Tier 1 (basic ID) 3% · Tier 2 (enhanced KYC + track record) 5%
fn tier_ceiling_bps(tier: u32) -> u32 {
    match tier {
        0 => 0,
        1 => 300,
        _ => 500,
    }
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    Platform,
    PlatformBps,
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
    /// Creator reward, snapshotted at creation. Immutable for this campaign.
    pub creator_bps: u32,
    /// Platform fee, snapshotted at creation so a later policy change cannot
    /// move the split under a donor who already gave.
    pub platform_bps: u32,
    pub tier: u32,
    pub raised: i128,
    /// Withdrawable immediately. The beneficiary does not wait for the creator
    /// to finish paperwork.
    pub beneficiary_available: i128,
    /// Held until proof exists. This is the trust mechanic.
    pub creator_locked: i128,
    pub platform_accrued: i128,
    pub proof_uploaded: bool,
}

// Every state transition emits an event. A campaign's whole financial life is
// reconstructible from the ledger by anyone, without asking us for anything.

#[contractevent]
pub struct PlatformFeeSet {
    pub platform_bps: u32,
}

#[contractevent]
pub struct TierSet {
    #[topic]
    pub organizer: Address,
    pub tier: u32,
}

#[contractevent]
pub struct CampaignCreated {
    #[topic]
    pub organizer: Address,
    pub campaign_id: u32,
    pub creator_bps: u32,
    pub platform_bps: u32,
}

#[contractevent]
pub struct Donated {
    #[topic]
    pub campaign_id: u32,
    #[topic]
    pub donor: Address,
    pub amount: i128,
    pub to_beneficiary: i128,
    pub to_creator: i128,
    pub to_platform: i128,
}

#[contractevent]
pub struct BeneficiaryWithdrawn {
    #[topic]
    pub campaign_id: u32,
    #[topic]
    pub beneficiary: Address,
    pub amount: i128,
}

#[contractevent]
pub struct ProofUploaded {
    #[topic]
    pub campaign_id: u32,
    #[topic]
    pub organizer: Address,
    pub proof_hash: BytesN<32>,
}

#[contractevent]
pub struct CreatorReleased {
    #[topic]
    pub campaign_id: u32,
    #[topic]
    pub organizer: Address,
    pub amount: i128,
}

#[contractevent]
pub struct PlatformWithdrawn {
    #[topic]
    pub campaign_id: u32,
    pub amount: i128,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    InvalidAmount = 2,
    /// creator_bps + platform_bps would exceed MAX_TOTAL_BPS.
    TotalFinancingExceeded = 3,
    /// creator_bps exceeds what this organizer's tier allows.
    TierTooLow = 4,
    InvalidTier = 5,
    CampaignNotFound = 6,
    Unauthorized = 7,
    InsufficientBalance = 8,
    ProofMissing = 9,
}

#[contract]
pub struct UlurinVault;

#[contractimpl]
impl UlurinVault {
    /// Runs once, atomically, at deploy. Not a callable `initialize` — that
    /// leaves a window where anyone can front-run and claim admin.
    pub fn __constructor(
        env: Env,
        admin: Address,
        token: Address,
        platform: Address,
        platform_bps: u32,
    ) -> Result<(), Error> {
        if platform_bps > MAX_TOTAL_BPS {
            return Err(Error::TotalFinancingExceeded);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Platform, &platform);
        env.storage()
            .instance()
            .set(&DataKey::PlatformBps, &platform_bps);
        env.storage().instance().set(&DataKey::NextId, &1u32);
        Ok(())
    }

    /// Applies to campaigns created from now on. Campaigns already open keep the
    /// fee their donors agreed to.
    pub fn set_platform_bps(env: Env, platform_bps: u32) -> Result<(), Error> {
        require_admin(&env)?;
        if platform_bps > MAX_TOTAL_BPS {
            return Err(Error::TotalFinancingExceeded);
        }
        env.storage()
            .instance()
            .set(&DataKey::PlatformBps, &platform_bps);
        PlatformFeeSet { platform_bps }.publish(&env);
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
        TierSet { organizer, tier }.publish(&env);
        Ok(())
    }

    /// The gate. A campaign whose total financing breaches the statutory cap
    /// cannot be opened, so there is no over-cap campaign to discover later.
    pub fn create_campaign(
        env: Env,
        organizer: Address,
        beneficiary: Address,
        creator_bps: u32,
    ) -> Result<u32, Error> {
        organizer.require_auth();

        let platform_bps: u32 = env
            .storage()
            .instance()
            .get(&DataKey::PlatformBps)
            .ok_or(Error::NotInitialized)?;

        // The law: total financing of this collection.
        if creator_bps + platform_bps > MAX_TOTAL_BPS {
            return Err(Error::TotalFinancingExceeded);
        }
        // The policy: what this organizer has earned the right to take.
        let tier = Self::tier_of(env.clone(), organizer.clone());
        if creator_bps > tier_ceiling_bps(tier) {
            return Err(Error::TierTooLow);
        }

        let id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NextId)
            .ok_or(Error::NotInitialized)?;
        env.storage().instance().set(&DataKey::NextId, &(id + 1));

        let campaign = Campaign {
            organizer: organizer.clone(),
            beneficiary,
            creator_bps,
            platform_bps,
            tier,
            raised: 0,
            beneficiary_available: 0,
            creator_locked: 0,
            platform_accrued: 0,
            proof_uploaded: false,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(id), &campaign);
        CampaignCreated {
            organizer,
            campaign_id: id,
            creator_bps,
            platform_bps,
        }
        .publish(&env);
        Ok(id)
    }

    /// Splits on arrival. The beneficiary takes the residual, so integer
    /// truncation always rounds in the beneficiary's favour, never the
    /// platform's.
    pub fn donate(env: Env, donor: Address, campaign_id: u32, amount: i128) -> Result<(), Error> {
        donor.require_auth();
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let token_id = token_id(&env)?;
        let mut campaign = get_campaign(&env, campaign_id)?;
        token::Client::new(&env, &token_id).transfer(
            &donor,
            &env.current_contract_address(),
            &amount,
        );

        let creator = amount * campaign.creator_bps as i128 / 10_000;
        let platform = amount * campaign.platform_bps as i128 / 10_000;
        let beneficiary = amount - creator - platform;

        campaign.raised += amount;
        campaign.beneficiary_available += beneficiary;
        campaign.creator_locked += creator;
        campaign.platform_accrued += platform;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        let donor_key = DataKey::DonorTotal(campaign_id, donor.clone());
        let prev: i128 = env.storage().persistent().get(&donor_key).unwrap_or(0);
        env.storage().persistent().set(&donor_key, &(prev + amount));

        // The split rides along with the event, so a receipt can be rebuilt from
        // the ledger alone without replaying the bps maths.
        Donated {
            campaign_id,
            donor,
            amount,
            to_beneficiary: beneficiary,
            to_creator: creator,
            to_platform: platform,
        }
        .publish(&env);
        Ok(())
    }

    /// No proof gate. Aid should not wait on the creator's reporting.
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

        campaign.beneficiary_available -= amount;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        pay(&env, &beneficiary, amount)?;
        BeneficiaryWithdrawn {
            campaign_id,
            beneficiary,
            amount,
        }
        .publish(&env);
        Ok(())
    }

    /// The hash commits the creator to a file they cannot swap afterwards. It
    /// does not prove what the file shows — a human still reviews that.
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
        ProofUploaded {
            campaign_id,
            organizer,
            proof_hash,
        }
        .publish(&env);
        Ok(())
    }

    /// Admin-signed on purpose. A creator who could release their own reward
    /// after uploading any 32 bytes would make the proof gate decorative.
    pub fn release_creator(env: Env, campaign_id: u32, amount: i128) -> Result<(), Error> {
        require_admin(&env)?;
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }
        let mut campaign = get_campaign(&env, campaign_id)?;
        if !campaign.proof_uploaded {
            return Err(Error::ProofMissing);
        }
        if amount > campaign.creator_locked {
            return Err(Error::InsufficientBalance);
        }

        campaign.creator_locked -= amount;
        let organizer = campaign.organizer.clone();
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        pay(&env, &organizer, amount)?;
        CreatorReleased {
            campaign_id,
            organizer,
            amount,
        }
        .publish(&env);
        Ok(())
    }

    pub fn withdraw_platform(env: Env, campaign_id: u32, amount: i128) -> Result<(), Error> {
        let platform: Address = env
            .storage()
            .instance()
            .get(&DataKey::Platform)
            .ok_or(Error::NotInitialized)?;
        platform.require_auth();
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }
        let mut campaign = get_campaign(&env, campaign_id)?;
        if amount > campaign.platform_accrued {
            return Err(Error::InsufficientBalance);
        }

        campaign.platform_accrued -= amount;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        pay(&env, &platform, amount)?;
        PlatformWithdrawn {
            campaign_id,
            amount,
        }
        .publish(&env);
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

    /// (max_total_bps, platform_bps) — so the UI renders the cap it is actually
    /// bound by rather than a number typed into a component.
    pub fn config(env: Env) -> Result<(u32, u32), Error> {
        let platform_bps: u32 = env
            .storage()
            .instance()
            .get(&DataKey::PlatformBps)
            .ok_or(Error::NotInitialized)?;
        Ok((MAX_TOTAL_BPS, platform_bps))
    }

    /// What this tier may take, given the platform fee in force. The create
    /// screen reads its slider ceiling from here instead of hardcoding it.
    pub fn ceiling_for(env: Env, tier: u32) -> Result<u32, Error> {
        let platform_bps: u32 = env
            .storage()
            .instance()
            .get(&DataKey::PlatformBps)
            .ok_or(Error::NotInitialized)?;
        let by_law = MAX_TOTAL_BPS.saturating_sub(platform_bps);
        let by_tier = tier_ceiling_bps(tier);
        Ok(if by_tier < by_law { by_tier } else { by_law })
    }
}

fn get_campaign(env: &Env, campaign_id: u32) -> Result<Campaign, Error> {
    env.storage()
        .persistent()
        .get(&DataKey::Campaign(campaign_id))
        .ok_or(Error::CampaignNotFound)
}

fn token_id(env: &Env) -> Result<Address, Error> {
    env.storage()
        .instance()
        .get(&DataKey::Token)
        .ok_or(Error::NotInitialized)
}

fn pay(env: &Env, to: &Address, amount: i128) -> Result<(), Error> {
    let token_id = token_id(env)?;
    token::Client::new(env, &token_id).transfer(&env.current_contract_address(), to, &amount);
    Ok(())
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

mod test;
