#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.cargo/bin:/usr/local/bin:$PATH"

NET="${STELLAR_NETWORK:-testnet}"
SOURCE="${STELLAR_SOURCE:-ulurin-deployer}"
TOKEN="${ULURIN_TOKEN_CONTRACT:-}"
export STELLAR_INCLUSION_FEE="${STELLAR_INCLUSION_FEE:-100000}"

if ! command -v stellar >/dev/null 2>&1; then
  echo "stellar CLI not found. Install it first: https://developers.stellar.org/docs/tools/cli" >&2
  exit 1
fi

if ! command -v cargo >/dev/null 2>&1; then
  echo "Rust/Cargo not found. Install Rust first: https://rustup.rs" >&2
  exit 1
fi

rustup target add wasm32v1-none >/dev/null 2>&1 || true
stellar keys generate "$SOURCE" --network "$NET" --fund >/dev/null 2>&1 || true
stellar keys fund "$SOURCE" --network "$NET" >/dev/null 2>&1 || true

ADMIN="$(stellar keys address "$SOURCE")"

if [ -z "$TOKEN" ]; then
  TOKEN="$(stellar contract asset deploy --asset native --source "$SOURCE" --network "$NET" 2>/dev/null \
    || stellar contract id asset --asset native --network "$NET")"
fi

echo "=== build ==="
stellar contract build --package ulurin-campaign

W="${CARGO_TARGET_DIR:-target}/wasm32v1-none/release/ulurin_campaign.wasm"
if [ ! -f "$W" ]; then
  echo "WASM not found at $W" >&2
  exit 1
fi

echo "=== deploy ==="
CID="$(stellar contract deploy --wasm "$W" --source "$SOURCE" --network "$NET")"

echo "=== initialize ==="
stellar contract invoke --id "$CID" --source "$SOURCE" --network "$NET" -- \
  initialize --admin "$ADMIN" --token "$TOKEN"

cat <<EOF

ULURIN_CAMPAIGN_CONTRACT=$CID
ULURIN_TOKEN_CONTRACT=$TOKEN
ULURIN_ADMIN=$ADMIN
STELLAR_NETWORK=$NET
EOF
