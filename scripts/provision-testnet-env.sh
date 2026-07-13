#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.cargo/bin:/usr/local/bin:$PATH"

if ! command -v stellar >/dev/null 2>&1; then
  echo "stellar CLI not found. Install it first: brew install stellar-cli" >&2
  exit 1
fi

NET="${STELLAR_NETWORK:-testnet}"
ENVF=".env.local"
CONTRACT="${ULURIN_CAMPAIGN_CONTRACT:-CARFPJ3NBQJNRLVFYJKRZNSFWWXE6HPY6FOMUVK4AU5BZWSP6LESG3EA}"
TOKEN="${ULURIN_TOKEN_CONTRACT:-CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC}"

mkkey() {
  stellar keys generate "$1" --network "$NET" --fund >/dev/null 2>&1 || true
  stellar keys fund "$1" --network "$NET" >/dev/null 2>&1 || true
}

mkkey ulurin-deployer
mkkey ulurin-organizer
mkkey ulurin-donor
mkkey ulurin-beneficiary

tmp="$(mktemp)"
if [ -f "$ENVF" ]; then
  grep -vE '^(STELLAR_|ULURIN_)' "$ENVF" > "$tmp" || true
fi

cat > "$ENVF" < "$tmp"
cat >> "$ENVF" <<EOF

STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
ULURIN_CAMPAIGN_CONTRACT=$CONTRACT
ULURIN_TOKEN_CONTRACT=$TOKEN
ULURIN_DEFAULT_CAMPAIGN_ID=1
ULURIN_ADMIN_SECRET=$(stellar keys show ulurin-deployer)
ULURIN_ORGANIZER_SECRET=$(stellar keys show ulurin-organizer)
ULURIN_DONOR_SECRET=$(stellar keys show ulurin-donor)
ULURIN_BENEFICIARY_SECRET=$(stellar keys show ulurin-beneficiary)
EOF

rm -f "$tmp"
echo "Wrote $ENVF for Ulurin testnet demo."
echo "Contract: $CONTRACT"
echo "Default campaign: 1"
