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

Final campaign state:

```json
{
  "allowance_bps": 1000,
  "allowance_escrow": "0",
  "beneficiary_available": "0",
  "proof_uploaded": true,
  "raised": "10000000",
  "tier": 2
}
```
