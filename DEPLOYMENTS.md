# Bagibagi Testnet Deployments

Network: Stellar Testnet

## Bagibagi Campaign Contract

| Item | Value |
|---|---|
| Contract | `CARFPJ3NBQJNRLVFYJKRZNSFWWXE6HPY6FOMUVK4AU5BZWSP6LESG3EA` |
| Token | Native XLM SAC, `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| Admin | `GC6HREDFKZYLF7HUNXLVY55RDEIDYDATW6TSVCPV3OITAPMDIEJNJ5U3` |
| WASM hash | `49b63f3c54ac1e4f9e1ef3c76073229fe8d8117966cd6f50652558d758e52cd1` |

## Deployment Trail

| Step | Transaction |
|---|---|
| Upload WASM | [`9639b1d1570a42eda6fb0dff514d3fab629497098e33bc923402268666bf71fc`](https://stellar.expert/explorer/testnet/tx/9639b1d1570a42eda6fb0dff514d3fab629497098e33bc923402268666bf71fc) |
| Deploy contract | [`e12b9800480450f82a6ecb49bdbd13685fb0fe74467a5b1bd9151762a1e95c2e`](https://stellar.expert/explorer/testnet/tx/e12b9800480450f82a6ecb49bdbd13685fb0fe74467a5b1bd9151762a1e95c2e) |
| Initialize | [`287647d9d8ee270cfe5109ee8509d8b665aa1b4bf9af2a3cf058432cabc697aa`](https://stellar.expert/explorer/testnet/tx/287647d9d8ee270cfe5109ee8509d8b665aa1b4bf9af2a3cf058432cabc697aa) |

## Live Smoke Flow

Campaign `1` was exercised end to end with a 10% organizer allowance.

| Step | Transaction |
|---|---|
| Set organizer tier 2 | [`1f21c1627af6a2623acc7bae2c58c22dc2f49ac53037add0a2b6a41749fee168`](https://stellar.expert/explorer/testnet/tx/1f21c1627af6a2623acc7bae2c58c22dc2f49ac53037add0a2b6a41749fee168) |
| Create campaign | [`de255048adba4d2bc3c87b18ffdfe3dcd15a2cdbd9f7240f7d2a37c4cceddf39`](https://stellar.expert/explorer/testnet/tx/de255048adba4d2bc3c87b18ffdfe3dcd15a2cdbd9f7240f7d2a37c4cceddf39) |
| Donate `10,000,000` stroops | [`62a7552dd159a4ad9fa19f624eeb3c6144fd56e17c354c8d24001dfb2fd6bc93`](https://stellar.expert/explorer/testnet/tx/62a7552dd159a4ad9fa19f624eeb3c6144fd56e17c354c8d24001dfb2fd6bc93) |
| Withdraw beneficiary `9,000,000` stroops | [`45f9a17ab5fbe88aae6fa00af62c1163c6f0e2a6d104028d04cfcda65132515b`](https://stellar.expert/explorer/testnet/tx/45f9a17ab5fbe88aae6fa00af62c1163c6f0e2a6d104028d04cfcda65132515b) |
| Upload proof hash | [`213007c21551d97effb594c5179656ab59d49f09b3ab71ad3a4df83c514a9dd6`](https://stellar.expert/explorer/testnet/tx/213007c21551d97effb594c5179656ab59d49f09b3ab71ad3a4df83c514a9dd6) |
| Release allowance `1,000,000` stroops | [`914b981157273c3c69ef9ccf2dc1d935fbdb40a80e5504b785c152ba70bbb8f3`](https://stellar.expert/explorer/testnet/tx/914b981157273c3c69ef9ccf2dc1d935fbdb40a80e5504b785c152ba70bbb8f3) |
| App helper donate `123` stroops | [`0d7d47cfe8c8a3811fdf8ced201e8f78d47dcc644b344ec36a1b510a7c2acd8b`](https://stellar.expert/explorer/testnet/tx/0d7d47cfe8c8a3811fdf8ced201e8f78d47dcc644b344ec36a1b510a7c2acd8b) |
| App helper withdraw `111` stroops | [`5237b7b1691cba2d7850751a08415156b13e1a1502e9b9c347d9e7c44f751e69`](https://stellar.expert/explorer/testnet/tx/5237b7b1691cba2d7850751a08415156b13e1a1502e9b9c347d9e7c44f751e69) |
| App helper release `12` stroops | [`8758c019d3f862d02725c6e788539d9faa51b1d1761ee87280cca7df93f3cc32`](https://stellar.expert/explorer/testnet/tx/8758c019d3f862d02725c6e788539d9faa51b1d1761ee87280cca7df93f3cc32) |

Final campaign state:

```json
{
  "allowance_bps": 1000,
  "allowance_escrow": "0",
  "beneficiary_available": "0",
  "proof_uploaded": true,
  "raised": "10000123",
  "tier": 2
}
```

## App Wiring Smoke

The server helper used by the Next.js app also created campaign `2` with a 5%
allowance:

| Step | Transaction |
|---|---|
| Create campaign `2` from app helper | [`6aa2aac6d4e873dd19bb78700799546de61a3c6729d711c3da2b8ec19dd4126b`](https://stellar.expert/explorer/testnet/tx/6aa2aac6d4e873dd19bb78700799546de61a3c6729d711c3da2b8ec19dd4126b) |
