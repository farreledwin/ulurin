# Ulurin Android QA

## 2026-07-16 — rebuilt with the Stellar layer, and the chain read verified on device

The APK from 2026-07-15 was stale: built before `src/lib/stellar.js` existed,
carrying a single JS chunk with no Stellar code in it. Every check in the
original run below was therefore performed against a build with no chain layer.
Rebuilt and re-verified.

### Artifact

| | |
|---|---|
| APK | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Size | 9,088,941 bytes (was 8,941,301) |
| SHA-256 | `1B8E6A2FBEEF9D5DEF21B61C44D0235EB1F8363F7FF58B8A8D11F42E08DEC32B` |
| JDK | Temurin 21.0.11 |
| Emulator | `Ulurin_API_36`, `emulator-5556`, API 36 |

Two JS chunks now, not one — the app and the SDK, split by the dynamic import:

```
assets/public/assets/index-BpVVzROd.js   486,828 B   soroban, networkPassphrase, CBDQHOGS, stellar.expert
assets/public/assets/index-CEg1LjPd.js   444,831 B   soroban, networkPassphrase
```

The vault's contract id and `/api/vault` are both present in the bundle. The
USDC SAC id is not, and that is correct: `TOKEN_ID` has no consumer in the UI,
so Rollup drops it.

### The question this run existed to answer

Whether `@stellar/stellar-sdk` merely *ships* in the APK or actually *runs*
inside the Capacitor WebView. Shipping was never in doubt; running was, and had
been asserted several times without evidence.

**It runs.** On `/dashboard`, the release section rendered:

> Imbalan Kreator — **Rp 129.700 siap dirilis**  ·  [Rilis imbalan]
> Angka di atas dibaca langsung dari vault (**164,13 USDC** terkumpul) dan
> dikonversi pada kurs demo Rp 16.000/USDC.

164.13 USDC is live state from `CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3`
— it is not in the seed data and cannot be. An unauthenticated
`simulateTransaction` therefore completed from inside the WebView, over plain
HTTPS, with no wallet, no extension, and no Buffer polyfill. The release button
is enabled because the contract's `proof_uploaded` is true, which is also read
state rather than local state.

Derived dashboard figures rendered correctly on device too: `Total pembiayaan
7% · 5% imbalan + 2% platform, batas 10%`, and `Tier 2 · maks 5% imbalan`.

### Checks

- `cap sync android` copied `dist/` into `android/app/src/main/assets/public`.
- `assembleDebug` succeeded on Temurin 21.
- Installed with replacement, launched `id.ulurin.app/.MainActivity`, pid alive.
- **0 lines in the crash buffer, 0 FATAL in logcat.**
- Both JS chunks served: `Capacitor: Handling local request: .../index-CEg1LjPd.js` and `.../index-BpVVzROd.js`.

### Two environment traps, recorded so the next person does not lose an hour

**OneDrive locks the build directory.** `assembleDebug` fails with
`Unable to delete directory ... a process has files open`, first on
`node_modules/@capacitor/android/capacitor/build`, then on
`app/build/intermediates`. It is OneDrive syncing, not a Gradle bug. Fix:
`./gradlew --stop`, wait a few seconds, `rm -rf app/build .gradle`, then build
in one pass. Retrying without the full clean just moves the lock elsewhere.

**Capacitor 8 compiles at source release 21.** With Temurin 17 the build dies
on `invalid source release: 21` — nothing to do with the app. The Environment
section below already said "Java: Temurin 21"; that JDK had since been removed
from the machine. Temurin 21 was reinstalled via
`winget install EclipseAdoptium.Temurin.21.JDK`, and the build was pointed at
it with `-Dorg.gradle.java.home` rather than changing the machine's `JAVA_HOME`.

### Still simulated

Rupiah donations, Xendit, ratings, proof review, and the activity ticker. The
vault, the split, the proof gate, and the release are real testnet.

---

## Environment (original run, 2026-07-15 — pre-Stellar)

- Device: dedicated Android emulator `Ulurin_API_36`
- Serial: `emulator-5556`
- Android API: 36
- Package: `id.ulurin.app`
- Activity: `id.ulurin.app/.MainActivity`
- Java: Temurin 21

## Artifact

- APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Size: 8,941,301 bytes
- SHA-256: `14228E7E12FA535AF40A6BE5DE7EAEAB4AB7B8CA2BCB55782DE5DA0BA6CAF035`

## Checks completed

- Capacitor web assets synchronized from the final production build.
- Debug APK assembled successfully.
- APK installed with replacement enabled.
- Main activity launched and remained focused.
- App process remained alive after launch.
- Android WebView rendered the compact landing page with system insets respected, the primary call to action visible, and the next proof section beginning in the first viewport.
- The landing call to action opened the story feed through a coordinate derived from the inspected WebView bounds.
- The story feed displayed campaign context, the 90/5/5 split, and the donation call to action in one viewport.
- Moving from the first story to Dapur Berbagi changed the proposed amount from Rp 50.000 to Rp 25.000 and recalculated the split to Rp 22.500, Rp 1.250, and Rp 1.250.
- The simulation disclosure rendered as an icon-only header action without the previous dark circle or wordmark overlap.
- The story donation action opened the donation form.
- The donation form exposed preset amounts and the compact split before any full-page scroll.
- Selecting Rp 100.000 updated the accessible UI tree to Rp 90.000 for the recipient, Rp 5.000 for the creator, and Rp 5.000 for Ulurin.
- Landing, story, and donation states were inspected visually at 1080 x 2400.
- Fatal log lines: 0.
- Android crash buffer lines: 0.
- Capacitor console error lines during the final run: 0.
- Seven optimized creator portraits were packaged with the final web assets.
- The updated APK launched successfully after a clean package reset and kept process `id.ulurin.app` alive.
- The 1080 x 2400 launch screenshot confirms the responsive shell, safe system insets, documentary hero crop, and primary action remain intact after adding creator history and comment flows.
- Sixteen unique completed-campaign documentary assets are packaged in the APK, with no reuse of active campaign photography.
- The final APK was installed on `emulator-5556`; package process `id.ulurin.app` remained alive and app-scoped fatal or Capacitor console error matches were 0.
- Final Android screenshot: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-image-audit-20260715/android-landing.png`.
- The Android accessibility tree exposes the prototype as one WebView node, so detailed route interaction was verified through the equivalent 390 x 844 browser viewport while the native run covered package install, launch, rendering, process survival, and crash logs.

## Scope note

This validates the local Android prototype shell and responsive WebView experience. Payment, Stellar settlement, account custody, proof verification, and Xendit integration remain simulated.
