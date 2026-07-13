#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::{StellarAssetClient, TokenClient},
    Address, BytesN, Env,
};

fn token_setup<'a>(
    env: &Env,
    admin: &Address,
) -> (Address, StellarAssetClient<'a>, TokenClient<'a>) {
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let addr = sac.address();
    (
        addr.clone(),
        StellarAssetClient::new(env, &addr),
        TokenClient::new(env, &addr),
    )
}

fn app_setup(env: &Env) -> (UlurinCampaignClient<'_>, Address, TokenClient<'_>) {
    env.mock_all_auths();
    let admin = Address::generate(env);
    let (token_id, _token_admin, token) = token_setup(env, &admin);
    let contract_id = env.register(UlurinCampaign, ());
    let app = UlurinCampaignClient::new(env, &contract_id);
    app.initialize(&admin, &token_id);
    (app, admin, token)
}

#[test]
fn donation_split_and_allowance_release() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let organizer = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let donor = Address::generate(&env);
    let (token_id, token_admin, token) = token_setup(&env, &admin);
    token_admin.mint(&donor, &1_000);

    let contract_id = env.register(UlurinCampaign, ());
    let app = UlurinCampaignClient::new(&env, &contract_id);
    app.initialize(&admin, &token_id);
    app.set_tier(&organizer, &2);

    let campaign_id = app.create_campaign(&organizer, &beneficiary, &1_000);
    app.donate(&donor, &campaign_id, &1_000);

    let campaign = app.campaign(&campaign_id);
    assert_eq!(campaign.raised, 1_000);
    assert_eq!(campaign.beneficiary_available, 900);
    assert_eq!(campaign.allowance_escrow, 100);
    assert_eq!(app.donor_total(&campaign_id, &donor), 1_000);

    app.withdraw_beneficiary(&campaign_id, &beneficiary, &900);
    assert_eq!(token.balance(&beneficiary), 900);
    assert!(app.try_release_allowance(&campaign_id, &100).is_err());

    let proof = BytesN::from_array(&env, &[7; 32]);
    app.upload_proof(&campaign_id, &organizer, &proof);
    assert_eq!(app.proof_hash(&campaign_id), proof);
    app.release_allowance(&campaign_id, &100);

    let campaign = app.campaign(&campaign_id);
    assert_eq!(campaign.beneficiary_available, 0);
    assert_eq!(campaign.allowance_escrow, 0);
    assert_eq!(token.balance(&organizer), 100);
}

#[test]
fn tier_caps_allowance() {
    let env = Env::default();
    let (app, _admin, _token) = app_setup(&env);
    let organizer = Address::generate(&env);
    let beneficiary = Address::generate(&env);

    assert!(app
        .try_create_campaign(&organizer, &beneficiary, &1)
        .is_err());

    app.set_tier(&organizer, &1);
    assert!(app
        .try_create_campaign(&organizer, &beneficiary, &501)
        .is_err());

    let id = app.create_campaign(&organizer, &beneficiary, &500);
    assert_eq!(app.campaign(&id).allowance_bps, 500);
}
