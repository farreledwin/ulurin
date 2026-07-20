# Ulurin local prototype

This package is the runnable experience layer for Ulurin. It covers the public landing page, story-first campaign discovery, marketplace discovery, campaign detail, transparent donation simulation, receipt, creator reputation, proof trail, verified-donor rating, live activity, and creator dashboard.

## Run locally

Requirements: Node.js 20 or newer.

```powershell
npm install
npm run dev
```

The development server is available at `http://localhost:5173` unless another port is supplied.

## Verify

```powershell
npm test
npm run build
```

## Android wrapper

The same responsive app is packaged with Capacitor so the web and Android prototype share one product flow.

```powershell
npm run android:sync
npm run android:open
```

Java 21, Android Studio or the Android command-line tools, and an Android SDK are required for a device build. The checked Android project targets API 36.

## Honest scope

- All campaigns and creator identities in the prototype are illustrative fictional data.
- Xendit Sandbox is represented as a local payment simulation. No Xendit secret or real payment credential is requested.
- Transaction hashes and Stellar links are clearly marked as Testnet-style demo evidence. No real Stellar transaction is submitted.
- The selected donation amount is treated as the full total. The prototype shows a 5% platform share, up to 5% for the sample verified creator, and the remainder for the beneficiary. This is not yet a final legal or accounting policy.
- The ledger can show that a transaction and split occurred. It cannot prove identity, invoice authenticity, delivery, or real-world impact on its own.

Product reasoning and bilingual business documentation remain in the repository root and `docs` folder.
