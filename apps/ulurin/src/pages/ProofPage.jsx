import {
  ArrowLeft,
  ArrowSquareOut,
  Check,
  FileArrowUp,
  Info,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCampaign } from "../data/campaigns.js";
import "../components/release-status.css";
import { CHAIN_CAMPAIGN_ID, txUrl, uploadProofOnchain } from "../lib/stellar.js";

export function ProofPage() {
  const { slug } = useParams();
  const campaign = getCampaign(slug);
  const [files, setFiles] = useState([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!campaign) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (!files.length || !acknowledged || sending) return;
    setSending(true);
    setError(null);
    try {
      setResult(await uploadProofOnchain({ campaignId: CHAIN_CAMPAIGN_ID, files, note }));
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  if (result) {
    return (
      <div className="create-success page-gutter">
        <Check size={46} weight="bold" />
        <h1>Bukti tercatat di kontrak.</h1>
        <p>
          Sidik jari bukti Anda sekarang ada di Stellar Testnet, jadi file ini tidak bisa ditukar diam-diam
          setelah ini. Imbalan Kreator tetap terkunci sampai reviewer mengonfirmasi isinya — kontrak
          menjaga urutannya, manusia menilai isinya.
        </p>
        <code className="proof-hash">{result.proofHash}</code>
        <a className="text-link" href={txUrl(result.hash)} target="_blank" rel="noreferrer">
          Lihat transaksinya <ArrowSquareOut size={16} />
        </a>
        <Link className="button button--mint" to="/dashboard">Lihat status di dashboard</Link>
      </div>
    );
  }

  return (
    <div className="proof-upload-page page-gutter">
      <Link className="back-link" to="/dashboard"><ArrowLeft size={18} /> Dashboard Kreator</Link>
      <header>
        <span>Unggah bukti</span>
        <h1>{campaign.shortTitle}</h1>
        <p>Bukti membantu reviewer memahami hasil dunia nyata. Hash hanya menjaga integritas file.</p>
      </header>
      <form onSubmit={submit}>
        <label className="upload-zone">
          <FileArrowUp size={34} />
          <strong>Pilih invoice atau dokumentasi</strong>
          <span>JPG, PNG, atau PDF. File dihitung sidik jarinya di perangkat Anda; yang dikirim hanya sidik jarinya.</span>
          <input type="file" multiple accept="image/png,image/jpeg,application/pdf" onChange={(event) => setFiles(Array.from(event.target.files || []))} />
        </label>
        {files.length ? <div className="selected-files">{files.map((file) => <div key={`${file.name}-${file.size}`}><Check size={16} /><span><strong>{file.name}</strong><small>{Math.ceil(file.size / 1024)} KB</small></span></div>)}</div> : null}
        <label className="field"><span>Catatan untuk reviewer</span><textarea required value={note} onChange={(event) => setNote(event.target.value)} placeholder="Jelaskan bukti ini, tanggal kegiatan, dan kaitannya dengan scope campaign." /></label>
        <label className="proof-requirement"><input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} /><span><strong>Penerima atau lembaga sudah mengonfirmasi bantuan</strong><small>Konfirmasi akan diminta ulang oleh reviewer bila diperlukan.</small></span></label>
        <p className="provider-note"><Info size={17} /> Hindari wajah anak, alamat lengkap, nomor identitas, data medis, dan dokumen yang belum disensor.</p>
        {error ? <p className="field-error"><WarningCircle size={17} /> {error}</p> : null}
        <button className="button button--mint button--full" type="submit" disabled={!files.length || !acknowledged || sending}>
          <ShieldCheck size={18} /> {sending ? "Mencatat sidik jari di kontrak..." : "Kirim dan catat di kontrak"}
        </button>
      </form>
    </div>
  );
}
