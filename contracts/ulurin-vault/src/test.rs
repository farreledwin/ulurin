#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::{StellarAssetClient, TokenClient},
    Address, BytesN, Env,
};

const PLATFORM_BPS: u32 = 500; // 5%, the shipped policy

struct Fixture<'a> {
    env: Env,
    app: UlurinVaultClient<'a>,
    token: TokenClient<'a>,
    organizer: Address,
    beneficiary: Address,
    donor: Address,
    platform: Address,
}

fn setup(platform_bps: u32) -> Fixture<'static> {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let organizer = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let donor = Address::generate(&env);
    let platform = Address::generate(&env);

    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let token_id = sac.address();
    StellarAssetClient::new(&env, &token_id).mint(&donor, &1_000_000);

    let contract_id = env.register(
        UlurinVault,
        (admin.clone(), token_id.clone(), platform.clone(), platform_bps),
    );

    Fixture {
        app: UlurinVaultClient::new(&env, &contract_id),
        token: TokenClient::new(&env, &token_id),
        env,
        organizer,
        beneficiary,
        donor,
        platform,
    }
}

/// THE THESIS. PP 29/1980 Pasal 6(1) caps total financing at 10%. A campaign
/// that would breach it must be impossible to open — not detectable afterwards.
#[test]
fn total_financing_cap_blocks_creation_before_any_money_moves() {
    let f = setup(600); // platform takes 6%
    f.app.set_tier(&f.organizer, &2);

    // 6% platform + 5% creator = 11% > 10%. The tier would allow the 5%; the law does not.
    let err = f
        .app
        .try_create_campaign(&f.organizer, &f.beneficiary, &500)
        .unwrap_err()
        .unwrap();
    assert_eq!(err, Error::TotalFinancingExceeded);

    // 6% + 4% = 10%. Exactly at the cap, so it stands.
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &400);
    assert_eq!(f.app.campaign(&id).creator_bps, 400);
}

/// The platform fee cannot be set above the cap either — otherwise no campaign
/// could ever be created and the contract would be silently bricked.
#[test]
fn platform_fee_cannot_exceed_the_cap() {
    let f = setup(PLATFORM_BPS);
    let err = f.app.try_set_platform_bps(&1_100).unwrap_err().unwrap();
    assert_eq!(err, Error::TotalFinancingExceeded);
}

/// A fee change must not move the split under a donor who already gave.
#[test]
fn platform_fee_is_snapshotted_at_creation() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);
    assert_eq!(f.app.campaign(&id).platform_bps, 500);

    f.app.set_platform_bps(&200);

    // The open campaign keeps the terms its donors agreed to.
    assert_eq!(f.app.campaign(&id).platform_bps, 500);
    // Only the next one gets the new fee — and the freed headroom.
    let next = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);
    assert_eq!(f.app.campaign(&next).platform_bps, 200);
}

/// The full money path: split on arrival, creator locked until proof exists.
#[test]
fn donation_splits_three_ways_and_creator_waits_for_proof() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);

    f.app.donate(&f.donor, &id, &100_000);

    // 90 / 5 / 5, the split the donor was shown before giving.
    let c = f.app.campaign(&id);
    assert_eq!(c.raised, 100_000);
    assert_eq!(c.beneficiary_available, 90_000);
    assert_eq!(c.creator_locked, 5_000);
    assert_eq!(c.platform_accrued, 5_000);
    assert_eq!(f.app.donor_total(&id, &f.donor), 100_000);

    // No proof yet: the reward does not move.
    let err = f.app.try_release_creator(&id, &5_000).unwrap_err().unwrap();
    assert_eq!(err, Error::ProofMissing);
    assert_eq!(f.token.balance(&f.organizer), 0);

    let proof = BytesN::from_array(&f.env, &[7; 32]);
    f.app.upload_proof(&id, &f.organizer, &proof);
    assert_eq!(f.app.proof_hash(&id), proof);

    f.app.release_creator(&id, &5_000);
    assert_eq!(f.token.balance(&f.organizer), 5_000);
    assert_eq!(f.app.campaign(&id).creator_locked, 0);
}

/// Aid must not wait on the creator's paperwork.
#[test]
fn beneficiary_is_paid_without_waiting_for_proof() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);
    f.app.donate(&f.donor, &id, &100_000);

    assert!(!f.app.campaign(&id).proof_uploaded);
    f.app.withdraw_beneficiary(&id, &f.beneficiary, &90_000);
    assert_eq!(f.token.balance(&f.beneficiary), 90_000);
}

/// The ladder: what the tier permits is what the contract permits.
#[test]
fn tier_caps_the_creator_reward() {
    let f = setup(PLATFORM_BPS);

    // Tier 0 takes nothing, not even 1 bp.
    let err = f
        .app
        .try_create_campaign(&f.organizer, &f.beneficiary, &1)
        .unwrap_err()
        .unwrap();
    assert_eq!(err, Error::TierTooLow);

    // Tier 1 stops at 3%.
    f.app.set_tier(&f.organizer, &1);
    let err = f
        .app
        .try_create_campaign(&f.organizer, &f.beneficiary, &301)
        .unwrap_err()
        .unwrap();
    assert_eq!(err, Error::TierTooLow);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &300);
    assert_eq!(f.app.campaign(&id).creator_bps, 300);

    // Tier 2 stops at 5%.
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);
    assert_eq!(f.app.campaign(&id).creator_bps, 500);

    // At a 5% platform fee, tier 2's ceiling and the statutory cap land on the
    // SAME number: 500 + 500 = 1000. So asking for 501 trips the law, not the
    // tier — and that is the honest error, because upgrading tier would not
    // help. The ladder has run out of room under the cap, not under the tier.
    let err = f
        .app
        .try_create_campaign(&f.organizer, &f.beneficiary, &501)
        .unwrap_err()
        .unwrap();
    assert_eq!(err, Error::TotalFinancingExceeded);
}

/// Which limit binds — and therefore which error the creator is shown — depends
/// on the platform fee. Drop the fee and tier 2 gets daylight under the cap, so
/// the tier becomes the real constraint again and the message says so.
#[test]
fn the_binding_limit_is_reported_honestly() {
    let f = setup(300); // platform 3% leaves 7% of headroom
    f.app.set_tier(&f.organizer, &2);

    // Tier 2 still stops at 5% even though the law would now allow 7%.
    // Upgrading is impossible (2 is the top), but the tier is what binds.
    assert_eq!(f.app.ceiling_for(&2), 500);
    assert_eq!(
        f.app
            .try_create_campaign(&f.organizer, &f.beneficiary, &501)
            .unwrap_err()
            .unwrap(),
        Error::TierTooLow
    );

    // Tier 1 is told to upgrade, not that it broke the law — true, and actionable.
    f.app.set_tier(&f.organizer, &1);
    assert_eq!(
        f.app
            .try_create_campaign(&f.organizer, &f.beneficiary, &400)
            .unwrap_err()
            .unwrap(),
        Error::TierTooLow
    );
}

/// Every rung of the ladder, against the statutory cap. This is the table the
/// product's whole legal argument rests on, so it gets pinned.
#[test]
fn every_tier_plus_platform_fee_stays_within_the_cap() {
    let f = setup(PLATFORM_BPS);
    for (tier, expected_ceiling) in [(0u32, 0u32), (1, 300), (2, 500)] {
        let ceiling = f.app.ceiling_for(&tier);
        assert_eq!(ceiling, expected_ceiling);
        assert!(
            ceiling + PLATFORM_BPS <= MAX_TOTAL_BPS,
            "tier {tier} breaches the cap"
        );
    }
    assert_eq!(f.app.config(), (MAX_TOTAL_BPS, PLATFORM_BPS));
}

/// The advertised ceiling must track the platform fee, or the create screen
/// offers a slider position the contract will reject.
#[test]
fn ceiling_shrinks_when_the_platform_fee_grows() {
    let f = setup(800); // platform 8% leaves only 2% of headroom
    assert_eq!(f.app.ceiling_for(&2), 200); // not tier 2's nominal 500
    assert_eq!(f.app.ceiling_for(&1), 200); // not tier 1's nominal 300
    assert_eq!(f.app.ceiling_for(&0), 0);
}

/// Truncation must never quietly shave the beneficiary's share.
#[test]
fn every_unit_is_accounted_for_and_rounding_favours_the_beneficiary() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);

    // 333 * 5% = 16.65 -> truncates to 16 each; the 2 leftover units go to the
    // beneficiary, never to the platform.
    f.app.donate(&f.donor, &id, &333);
    let c = f.app.campaign(&id);
    assert_eq!(c.creator_locked, 16);
    assert_eq!(c.platform_accrued, 16);
    assert_eq!(c.beneficiary_available, 301);
    assert_eq!(
        c.beneficiary_available + c.creator_locked + c.platform_accrued,
        c.raised
    );
}

#[test]
fn donations_accumulate_across_donors() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);
    let donor2 = Address::generate(&f.env);
    StellarAssetClient::new(&f.env, &f.token.address).mint(&donor2, &50_000);

    f.app.donate(&f.donor, &id, &100_000);
    f.app.donate(&donor2, &id, &50_000);
    f.app.donate(&f.donor, &id, &10_000);

    let c = f.app.campaign(&id);
    assert_eq!(c.raised, 160_000);
    assert_eq!(f.app.donor_total(&id, &f.donor), 110_000);
    assert_eq!(f.app.donor_total(&id, &donor2), 50_000);
}

#[test]
fn platform_can_collect_its_accrued_fee() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);
    f.app.donate(&f.donor, &id, &100_000);

    f.app.withdraw_platform(&id, &5_000);
    assert_eq!(f.token.balance(&f.platform), 5_000);
    assert_eq!(f.app.campaign(&id).platform_accrued, 0);
}

#[test]
fn a_stranger_cannot_take_the_beneficiary_share() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);
    f.app.donate(&f.donor, &id, &100_000);

    let stranger = Address::generate(&f.env);
    let err = f
        .app
        .try_withdraw_beneficiary(&id, &stranger, &1_000)
        .unwrap_err()
        .unwrap();
    assert_eq!(err, Error::Unauthorized);
}

#[test]
fn nobody_can_overdraw_any_balance() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);
    f.app.donate(&f.donor, &id, &100_000);

    assert_eq!(
        f.app
            .try_withdraw_beneficiary(&id, &f.beneficiary, &90_001)
            .unwrap_err()
            .unwrap(),
        Error::InsufficientBalance
    );

    f.app
        .upload_proof(&id, &f.organizer, &BytesN::from_array(&f.env, &[1; 32]));
    assert_eq!(
        f.app.try_release_creator(&id, &5_001).unwrap_err().unwrap(),
        Error::InsufficientBalance
    );
    assert_eq!(
        f.app.try_withdraw_platform(&id, &5_001).unwrap_err().unwrap(),
        Error::InsufficientBalance
    );
}

#[test]
fn a_stranger_cannot_pose_as_the_organizer_to_upload_proof() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);

    let stranger = Address::generate(&f.env);
    let err = f
        .app
        .try_upload_proof(&id, &stranger, &BytesN::from_array(&f.env, &[9; 32]))
        .unwrap_err()
        .unwrap();
    assert_eq!(err, Error::Unauthorized);
    assert!(!f.app.campaign(&id).proof_uploaded);
}

#[test]
fn zero_and_negative_amounts_are_rejected() {
    let f = setup(PLATFORM_BPS);
    f.app.set_tier(&f.organizer, &2);
    let id = f.app.create_campaign(&f.organizer, &f.beneficiary, &500);

    assert_eq!(
        f.app.try_donate(&f.donor, &id, &0).unwrap_err().unwrap(),
        Error::InvalidAmount
    );
    assert_eq!(
        f.app.try_donate(&f.donor, &id, &-1).unwrap_err().unwrap(),
        Error::InvalidAmount
    );
}

#[test]
fn unknown_campaign_is_reported_not_guessed() {
    let f = setup(PLATFORM_BPS);
    assert_eq!(
        f.app.try_campaign(&999).unwrap_err().unwrap(),
        Error::CampaignNotFound
    );
}

#[test]
fn tier_above_the_ladder_is_rejected() {
    let f = setup(PLATFORM_BPS);
    assert_eq!(
        f.app.try_set_tier(&f.organizer, &3).unwrap_err().unwrap(),
        Error::InvalidTier
    );
}
