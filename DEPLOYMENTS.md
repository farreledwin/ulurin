# Ulurin Vault — Stellar Testnet

Network: Stellar Testnet · Contract: `ulurin-vault` v0.1.0 · SDK: soroban-sdk 27

## Deployment

Settles in **USDC**, the asset the product is designed around. Rupiah is what
the donor sees; USDC is what the contract holds; the ledger is the record. The
contract has no concept of rupiah and does not need one — the cap it enforces is
a ratio, and ratios are invariant under exchange rates.

| Item | Value |
|---|---|
| Contract | [`CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3`](https://stellar.expert/explorer/testnet/contract/CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3) |
| WASM hash | `edfe8bfc72e146cb9052c0f3f395e591c69145323a630e4143627caed1fcb46c` |
| Token | **USDC** (Circle, testnet), SAC [`CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`](https://stellar.expert/explorer/testnet/contract/CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA) · issuer `GBBD47IF…FLA5` (`home_domain: centre.io`) |
| Admin | `GCJPAZVNDKXBVDQNQH7KIQN2WCYG7UICEQJT3W53MAOBHFFWIHLY65B5` |
| Platform | `GAQWNNXU5ZXHMU5CGPWOQ3JI74HFFSWUZKIB23AVAF7ONO7M4ZEKBZQL` |
| `config()` | `[1000, 200]` — cap 10%, platform fee 2% (lowered from 300 via `set_platform_bps`, see below) |

| Step | Transaction |
|---|---|
| Deploy + construct | [`29c66a22…`](https://stellar.expert/explorer/testnet/tx/29c66a22a93371fb079e481030bde48bbd53d333048c4162951220c0a4f562d4) |

### Getting testnet USDC without the faucet

`faucet.circle.com` is unreachable from Indonesian ISPs — the domain resolves to
`202.169.44.80`, a local address rather than Circle's, which is DNS-level
blocking rather than an outage. It is not a dependency worth having anyway.

The testnet DEX carries real USDC liquidity, so the accounts were funded by
swapping XLM through a path payment. No browser, no API key, no CAPTCHA, and it
runs in CI:

```
$ curl "https://horizon-testnet.stellar.org/paths/strict-receive?...&destination_amount=100"
  → pay 45.3403515 XLM  (direct)  => 100.0000000 USDC
```

`pathPaymentStrictReceive` with a 15% slippage buffer, after a `change_trust` to
`USDC:GBBD47IF…FLA5`. The issuer sets `auth_required: false`, so opening the
trustline needs no approval from Circle. Contracts hold SAC balances in contract
storage and need no trustline; only the G-addresses do.

There is no separate `initialize` step: the contract takes its admin, token,
platform address, and platform fee through `__constructor`, so it is configured
atomically at deploy. A callable `initialize` leaves a window in which anyone can
front-run the deployer and claim admin.

## Platform fee lowered to 2% (no redeploy)

The platform fee was moved from 3% to 2% on the same contract, without a
redeploy, by the admin calling `set_platform_bps(200)`
([tx](https://stellar.expert/explorer/testnet/tx/0814821ac7f80598102c2297569b34f8aa7af5a23a21ca753c815db15705df87)).
`config()` now returns `[1000, 200]`.

Campaigns keep the fee they were created under, so campaigns 1-2 stay at 300 bps
on chain; the app's live demo therefore moved to **campaign 3**, created after
the change at 5% creator + 2% platform and funded with 30 USDC — it settles the
93/5/2 split the UI advertises. `apps/ulurin/src/lib/stellar.js` reads it via
`CHAIN_CAMPAIGN_ID = 3`, and `stellar.test.js` binds `PLATFORM_FEE_PCT` to the
live `config().platformBps`, so UI and chain can no longer drift apart in silence.

| Step | Transaction |
|---|---|
| `set_platform_bps(200)` | [`0814821a…`](https://stellar.expert/explorer/testnet/tx/0814821ac7f80598102c2297569b34f8aa7af5a23a21ca753c815db15705df87) |
| Create campaign `3` (5% creator, 2% platform) | [`696c76ca…`](https://stellar.expert/explorer/testnet/tx/696c76ca5997084c3e449771cc9bac354f0efd109d3fb69327e858a587374ad3) |
| Donate `30 USDC` → 93/5/2 split | [`745fd800…`](https://stellar.expert/explorer/testnet/tx/745fd8003b3050a5fe2c9a302da4491c679756e9b2b3b77c4ce84b3f4364a94a) |

## The cap is enforced, not promised

**PP No. 29/1980 Pasal 6(1)** — *"Pembiayaan usaha pengumpulan sumbangan
sebanyak-banyaknya 10% (sepuluh persen) dari hasil pengumpulan sumbangan yang
bersangkutan."*

Total financing of a campaign is the creator reward plus the platform fee. Both
are checked when the campaign is opened, so an over-cap campaign cannot exist.

A tier-2 organizer attempted an 8% reward on top of the 3% platform fee — 11%
total:

```
$ stellar contract invoke --id CBDQHOGS… -- create_campaign \
    --organizer GDLZGIVR… --beneficiary GCEG7O37… --creator_bps 800

❌ error: transaction simulation failed: HostError: Error(Contract, #3)
```

`Error(Contract, #3)` is `TotalFinancingExceeded`. The call failed at
**simulation** — it never reached the network, cost nothing, and left no
campaign behind. The limit fails before the violation instead of surfacing in an
audit years later.

## Live smoke: campaign 1, end to end

Created at 5% creator + 3% platform = 8%, two points under the cap.

| Step | Amount | Transaction |
|---|---|---|
| Create campaign `1` | — | [`1f0b3042…`](https://stellar.expert/explorer/testnet/tx/1f0b30426719a0dbc8849b9b55ea3535a4e7c6c43a50c613aa1cab3aa2212fd8) |
| Donate | `100 USDC` | [`d887bd57…`](https://stellar.expert/explorer/testnet/tx/d887bd576c78d48b6d5a050a4386207dfb7f2ca4025c222ea54db2794ae60ca0) |
| Beneficiary withdraws, **no proof required** | `92 USDC` | [`8fdaaa80…`](https://stellar.expert/explorer/testnet/tx/8fdaaa80118a0ad89b2772dfa76baced89f40bebbdc0dc84cf5f08ccfb145fe7) |
| Release creator reward **before proof** | `5 USDC` | ❌ `Error(Contract, #9)` `ProofMissing` |
| Upload proof hash | — | [`0270f654…`](https://stellar.expert/explorer/testnet/tx/0270f6540e4ac91281d50770635a6f964d288e2f71660af87d11c61bb50474d6) |
| Release creator reward **after proof** | `5 USDC` | [`1b5f2ad3…`](https://stellar.expert/explorer/testnet/tx/1b5f2ad3df0dac1f4cabde52aa4004d2a278f2e21a09de9b542c0f7a65a58730) |
| Platform withdraws fee | `3 USDC` | [`10cbdc69…`](https://stellar.expert/explorer/testnet/tx/10cbdc69817acf80c95d9e1bb0d7e6c6fb6d4eea42475370cd47e47aec9fbbb7) |

The donation split on arrival, 92 / 5 / 3 (amounts in USDC units, 7 decimals):

```json
{
  "raised": "1000000000",
  "beneficiary_available": "920000000",
  "creator_locked": "50000000",
  "platform_accrued": "30000000",
  "creator_bps": 500, "platform_bps": 300, "tier": 2,
  "proof_uploaded": false
}
```

Final state, every balance settled:

```json
{
  "raised": "1000000000",
  "beneficiary_available": "0",
  "creator_locked": "0",
  "platform_accrued": "0",
  "proof_uploaded": true
}
```

Two orderings in that trail are deliberate:

- **The beneficiary was paid before any proof existed.** Aid does not wait on the
  creator's paperwork.
- **The creator was not.** The reward stayed locked until a proof hash landed,
  and the release is admin-signed — a creator who could release their own reward
  after uploading any 32 bytes would make the gate decorative.

## Campaign 2: the live one

Campaign 1 above is fully settled, so it reads as zeroes. Campaign 2 is funded
and untouched, which is what the app's on-chain panel displays — the escrow
actually holding money and the proof gate actually pending.

| Step | Amount | Transaction |
|---|---|---|
| Create campaign `2` | — | [`0d3baae5…`](https://stellar.expert/explorer/testnet/tx/0d3baae565eb9ef27e9df3f739fdc3c41f0c3d78aed24b5b3e3211160f4fa641) |
| Donate | `160 USDC` | [`00dae8f3…`](https://stellar.expert/explorer/testnet/tx/00dae8f3168a71a465ad996d75f8c68c18b84588c9537f230b12dfc3edee18b2) |

```json
{
  "raised": "1600000000",
  "beneficiary_available": "1472000000",
  "creator_locked": "80000000",
  "platform_accrued": "48000000",
  "proof_uploaded": false
}
```

`apps/ulurin` reads this state directly from the contract at
`src/lib/stellar.js` — an unauthenticated `simulateTransaction`, no secret key
and no backend, so it runs the same in the browser and in the Android WebView.
`src/lib/stellar.test.js` asserts the live contract still matches what the UI
believes about it.

## The ladder

Verification tier caps what the creator may take. `ceiling_for(tier)` returns the
lower of the tier's own ceiling and the room the cap leaves, so the create screen
reads its slider limit from the contract instead of hardcoding it.

| Tier | Verification | Creator ceiling | + platform 2% | Total |
|---|---|---|---|---|
| 0 | none | 0% | 2% | **2%** |
| 1 | basic ID | 3% | 2% | **5%** |
| 2 | enhanced KYC + track record | 5% | 2% | **7%** |

The platform fee is 2%, well under 5%, and the gap is the point. At 5% the top of
the ladder sits exactly on the statutory cap, so any cost a regulator counts that
we did not — a payment-gateway charge, for instance — puts a tier-2 campaign
over. At 2% the binding limit is the tier rather than the law: `ceiling_for(2)`
returns 500, not the 800 the cap would allow. That is the healthy state, and the
errors say so — a tier-2 organizer asking for 6% is told `TierTooLow`, not
`TotalFinancingExceeded`.

## What this contract does not do

It proves the **flow** — collected, split, disbursed — and gates the creator's
reward on a proof hash existing. It does **not** prove what the proof shows, or
that the money bought what the story promised. A human still reviews the file.
The hash only commits the creator to a file they cannot swap afterwards.

The platform fee here is the on-chain settlement of a fee that, in production,
is taken at the rupiah on-ramp. It lives in the contract because it counts
toward the statutory cap, and a cap that only measured the creator would let the
total breach silently.

## Reproduce

Requires the Rust toolchain and `stellar` CLI. On Windows, Smart App Control
blocks Cargo build scripts (`os error 4551`); build under WSL.

```bash
cargo test --workspace                                  # 18 tests
cargo build --target wasm32v1-none --release -p ulurin-vault

# Trustline first: the G-addresses need one to hold USDC, the contract does not.
# Circle sets auth_required=false, so this needs no approval from them.
stellar tx new change-trust --source <donor> --network testnet \
  --line USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5

stellar contract deploy --wasm ulurin_vault.wasm --source <admin> --network testnet \
  -- --admin <ADMIN_G…> --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
     --platform <PLATFORM_G…> --platform_bps 300
```

Fund the G-addresses by swapping XLM on the testnet DEX
(`pathPaymentStrictReceive`, ~45 XLM per 100 USDC) rather than through Circle's
faucet — see above. `apps/ulurin` then reads the vault with no key and no
backend; `npm test` there asserts the live contract still matches what the UI
believes about it.
