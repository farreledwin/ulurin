import { ArrowSquareOut, CheckCircle, CircleNotch, Clock, Receipt, WarningCircle } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatRupiah } from "../lib/finance.js";
import "./release-status.css";
import {
  CHAIN_CAMPAIGN_ID,
  DEMO_RATE_IDR_PER_USDC,
  formatUsdc,
  getCampaignState,
  releaseCreatorOnchain,
  txUrl,
  usdcUnitsToRupiah,
} from "../lib/stellar.js";

/// The release story, read from the vault instead of typed into JSX.
///
/// Rupiah leads because that is the unit this product speaks; USDC sits beside
/// it because that is what actually moved, and the rate that connects them is
/// printed rather than assumed. The previous version of this section stated
/// "Rp21.915.000 · 90% dari dana terkumpul" as a literal — a number that was
/// hand-multiplied once and would have drifted silently from the day the
/// contract went live.
export function ReleaseStatus({ slug }) {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(null);

  const load = useCallback(() => {
    getCampaignState(CHAIN_CAMPAIGN_ID).then(setState).catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  const release = async () => {
    if (!state || releasing) return;
    setReleasing(true);
    setError(null);
    try {
      const result = await releaseCreatorOnchain({
        campaignId: CHAIN_CAMPAIGN_ID,
        units: state.creatorLockedUnits,
      });
      setReleased(result);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setReleasing(false);
    }
  };

  if (error && !state) {
    return (
      <div className="dashboard-release-list">
        <div><WarningCircle size={22} /><span><strong>Tidak bisa membaca kontrak</strong><small>{error}</small></span></div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="dashboard-release-list">
        <div><CircleNotch size={22} /><span><strong>Membaca status dari kontrak...</strong><small>Stellar Testnet</small></span></div>
      </div>
    );
  }

  const beneficiary = BigInt(state.beneficiaryAvailableUnits);
  const locked = BigInt(state.creatorLockedUnits);
  const paid = beneficiary === 0n && BigInt(state.raisedUnits) > 0n;

  return (
    <>
      <div className="dashboard-release-list">
        <div className={paid ? "done" : undefined}>
          <CheckCircle size={22} weight={paid ? "fill" : "regular"} />
          <span>
            <strong>Bagian penerima {paid ? "sudah ditarik" : "tersedia"}</strong>
            <small>
              {formatRupiah(usdcUnitsToRupiah(state.beneficiaryAvailableUnits))} · {state.creatorBps / 100}% kreator
              dan {state.platformBps / 100}% platform sudah dipisahkan lebih dulu
            </small>
          </span>
          <span>{paid ? "Selesai" : "Siap"}</span>
        </div>

        <div className={state.proofUploaded ? "done" : undefined}>
          {state.proofUploaded ? <CheckCircle size={22} weight="fill" /> : <Clock size={22} />}
          <span>
            <strong>Bukti penyaluran</strong>
            <small>
              {state.proofUploaded
                ? "Sidik jarinya tercatat di kontrak dan tidak bisa ditukar diam-diam."
                : "Imbalan tidak akan cair sampai ini ada. Kontrak yang menolak, bukan kebijakan kami."}
            </small>
          </span>
          {state.proofUploaded ? <span>Tercatat</span> : <Link to={`/dashboard/bukti/${slug}`}>Lengkapi</Link>}
        </div>

        <div className={locked === 0n && state.proofUploaded ? "done" : undefined}>
          <Receipt size={22} />
          <span>
            <strong>Imbalan Kreator</strong>
            <small>
              {locked === 0n
                ? "Sudah cair."
                : `${formatRupiah(usdcUnitsToRupiah(state.creatorLockedUnits))} ${
                    state.proofUploaded ? "siap dirilis" : "masih terkunci"
                  }`}
            </small>
          </span>
          {locked > 0n && state.proofUploaded ? (
            <button type="button" className="button button--mint" onClick={release} disabled={releasing}>
              {releasing ? "Merilis..." : "Rilis imbalan"}
            </button>
          ) : (
            <span>{locked === 0n ? "Selesai" : "Menunggu"}</span>
          )}
        </div>
      </div>

      {error ? <p className="release-note release-note--error"><WarningCircle size={16} /> {error}</p> : null}

      {released ? (
        <p className="release-note">
          <CheckCircle size={16} weight="fill" /> Imbalan dirilis di testnet.{" "}
          <a className="text-link" href={txUrl(released.hash)} target="_blank" rel="noreferrer">
            Lihat transaksinya <ArrowSquareOut size={14} />
          </a>
        </p>
      ) : null}

      <p className="release-note">
        <ArrowSquareOut size={16} /> Angka di atas dibaca langsung dari vault ({formatUsdc(state.raisedUnits)}{" "}
        terkumpul) dan dikonversi pada kurs demo Rp {DEMO_RATE_IDR_PER_USDC.toLocaleString("id-ID")}/USDC.
        Rilis ditandatangani admin, bukan kreator — kalau kreator bisa merilis imbalannya sendiri, kunci
        buktinya cuma hiasan.
      </p>
    </>
  );
}
