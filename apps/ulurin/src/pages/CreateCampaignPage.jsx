import { ArrowLeft, ArrowRight, Check, ImageSquare, Info, LockKey } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MoneySplit } from "../components/MoneySplit.jsx";
import { campaigns } from "../data/campaigns.js";
import {
  MAX_TOTAL_FINANCING_PCT,
  PLATFORM_FEE_PCT,
  creatorCeilingPct,
  splitForCreatorFee,
} from "../lib/finance.js";

// A data-URL preview only — the prototype uploads nothing, everything stays on
// this screen. 12 MB keeps a video preview from freezing the tab. ponytail:
// production streams the file to object storage instead of holding a data URL.
const MAX_MEDIA_BYTES = 12 * 1024 * 1024;

export function CreateCampaignPage() {
  // The signed-in creator. Same stand-in the dashboard uses until there are
  // accounts; the point is that the ceiling below follows a real tier rather
  // than a number typed into the markup.
  const organizer = campaigns[0].organizer;
  const ceiling = creatorCeilingPct(organizer.tier);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [form, setForm] = useState({
    title: "",
    media: null,
    mediaType: null,
    mediaName: "",
    beneficiary: "",
    category: "Lingkungan",
    target: "",
    recurring: true,
    creatorFee: ceiling,
    creatorReason: "",
    completion: "",
    invoice: true,
    acknowledgement: true,
    documentation: true,
  });

  // Clamp on read as well as on the input. The slider's max stops a drag, but
  // it would not stop a stale value if the tier were ever lowered, and the
  // contract would reject that campaign with TierTooLow anyway. Better to be
  // wrong in the creator's favour on screen than to offer a split that cannot
  // be created.
  const creatorFee = Math.min(Number(form.creatorFee) || 0, ceiling);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const split = splitForCreatorFee(creatorFee);

  const handleMedia = (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // let the same file be re-picked after removal
    if (!file) return;
    const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
    if (!kind) return setMediaError("Hanya file foto atau video.");
    if (file.size > MAX_MEDIA_BYTES) return setMediaError("Ukuran maksimal 12 MB.");
    setMediaError("");
    const reader = new FileReader();
    reader.onload = () =>
      setForm((current) => ({ ...current, media: reader.result, mediaType: kind, mediaName: file.name }));
    reader.readAsDataURL(file);
  };
  const clearMedia = () =>
    setForm((current) => ({ ...current, media: null, mediaType: null, mediaName: "" }));

  if (submitted) {
    return (
      <div className="create-success page-gutter">
        <Check size={46} weight="bold" />
        <h1>Draft campaign tersimpan.</h1>
        <p>Prototype tidak mengirim draft untuk review nyata. Data hanya hidup pada layar ini.</p>
        <Link className="button button--mint" to="/dashboard">Kembali ke dashboard</Link>
      </div>
    );
  }

  return (
    <div className="create-page page-gutter">
      <Link className="back-link" to="/dashboard"><ArrowLeft size={18} /> Dashboard Kreator</Link>
      <header className="create-header">
        <div><span>Langkah {step} dari 3</span><h1>Buat campaign yang dapat dipahami sebelum orang membayar.</h1></div>
        <div className="create-progress"><span className={step >= 1 ? "active" : ""} /><span className={step >= 2 ? "active" : ""} /><span className={step >= 3 ? "active" : ""} /></div>
      </header>

      <div className="create-layout">
        <form className="create-form" onSubmit={(event) => {
          event.preventDefault();
          if (step < 3) setStep((current) => current + 1);
          else setSubmitted(true);
        }}>
          {step === 1 ? (
            <section className="form-section">
              <h2>Scope dan penerima</h2>
              <label className="field"><span>Judul campaign</span><input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Contoh: Empat aksi bersih sungai bulan ini" /></label>
              <div className="field">
                <span>Foto atau video campaign</span>
                {form.media ? (
                  <div className="media-preview">
                    {form.mediaType === "video" ? (
                      <video className="media-preview__media" src={form.media} controls />
                    ) : (
                      <img className="media-preview__media" src={form.media} alt="Preview campaign" />
                    )}
                    <div className="media-preview__meta">
                      <span className="media-preview__name">{form.mediaName}</span>
                      <label>Ganti<input type="file" accept="image/*,video/*" onChange={handleMedia} hidden /></label>
                      <button type="button" onClick={clearMedia}>Hapus</button>
                    </div>
                  </div>
                ) : (
                  <label className="media-dropzone">
                    <ImageSquare size={26} />
                    <strong>Pilih foto atau video</strong>
                    <small>JPG, PNG, atau MP4. Maks 12 MB. Tampil di kartu campaign.</small>
                    <input type="file" accept="image/*,video/*" onChange={handleMedia} hidden />
                  </label>
                )}
                {mediaError ? <p className="field-error">{mediaError}</p> : null}
              </div>
              <div className="field-grid">
                <label className="field"><span>Penerima atau proyek</span><input required value={form.beneficiary} onChange={(event) => update("beneficiary", event.target.value)} placeholder="Nama individu, lembaga, atau proyek" /></label>
                <label className="field"><span>Kategori</span><select value={form.category} onChange={(event) => update("category", event.target.value)}><option>Lingkungan</option><option>Pangan</option><option>Kesehatan</option><option>Pendidikan</option><option>Bencana</option></select></label>
              </div>
              <div className="field-grid">
                <label className="field"><span>Target rupiah</span><input required type="number" min="100000" value={form.target} onChange={(event) => update("target", event.target.value)} placeholder="30000000" /></label>
                <label className="choice-row choice-row--compact"><span><strong>Campaign berulang</strong><small>Satu kewajiban bukti per siklus.</small></span><input type="checkbox" checked={form.recurring} onChange={(event) => update("recurring", event.target.checked)} /></label>
              </div>
              <label className="field"><span>Kondisi selesai</span><textarea required value={form.completion} onChange={(event) => update("completion", event.target.value)} placeholder="Jelaskan hasil yang membuat campaign atau siklus ini dianggap selesai." /></label>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="form-section">
              <h2>Imbalan yang diungkap</h2>
              <p className="provider-note">
                <LockKey size={17} /> Tier {organizer.tier} Anda membatasi Imbalan Kreator di{" "}
                <strong>{ceiling}%</strong>. Ditambah {PLATFORM_FEE_PCT}% fee platform, total pembiayaan
                campaign ini maksimal {ceiling + PLATFORM_FEE_PCT}% — di bawah batas{" "}
                {MAX_TOTAL_FINANCING_PCT}% PP No. 29/1980 Pasal 6(1). Kontrak menolak campaign yang
                melewatinya, jadi slider ini berhenti di tempat yang sama dengan hukumnya.
              </p>
              <label className="fee-slider">
                <span><strong>Imbalan Kreator</strong><strong>{creatorFee}%</strong></span>
                <input
                  type="range"
                  min="0"
                  max={ceiling}
                  step="1"
                  value={creatorFee}
                  disabled={ceiling === 0}
                  onChange={(event) => update("creatorFee", event.target.value)}
                />
              </label>
              {ceiling === 0 ? (
                <p className="field-error">
                  Tier 0 tidak dapat mengambil Imbalan Kreator. Verifikasi identitas untuk membukanya.
                </p>
              ) : null}
              <MoneySplit split={split} amount={100000} tier={organizer.tier} />
              <label className="field"><span>Jelaskan untuk apa Imbalan Kreator digunakan</span><textarea required value={form.creatorReason} onChange={(event) => update("creatorReason", event.target.value)} placeholder="Transport, survei, koordinasi, dokumentasi, operasional, dan penghargaan wajar atas waktu Anda." /></label>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="form-section">
              <h2>Bukti yang wajib dipenuhi</h2>
              {[
                ["invoice", "Invoice atau bukti pengeluaran"],
                ["acknowledgement", "Konfirmasi penerima atau lembaga"],
                ["documentation", "Dokumentasi hasil yang bermartabat"],
              ].map(([key, label]) => (
                <label className="proof-requirement" key={key}><input type="checkbox" checked={form[key]} onChange={(event) => update(key, event.target.checked)} /><span><strong>{label}</strong><small>Wajib sebelum Imbalan Kreator dilepas.</small></span></label>
              ))}
              <div className="create-review">
                <span>Preview</span>
                {form.media ? (
                  form.mediaType === "video" ? (
                    <video className="create-review__media" src={form.media} muted />
                  ) : (
                    <img className="create-review__media" src={form.media} alt="" />
                  )
                ) : null}
                <h3>{form.title || "Campaign tanpa judul"}</h3>
                <p>{form.beneficiary || "Penerima belum diisi"} · {form.category}</p>
                <MoneySplit split={split} tier={organizer.tier} />
              </div>
            </section>
          ) : null}

          <div className="form-navigation">
            {step > 1 ? <button className="button button--outline-dark" type="button" onClick={() => setStep((current) => current - 1)}>Kembali</button> : <span />}
            <button className="button button--mint" type="submit">{step === 3 ? "Simpan draft" : "Lanjut"} <ArrowRight size={17} /></button>
          </div>
        </form>

        <aside className="create-guidance">
          <span>Guardrail campaign</span>
          <h2>Bantuan tidak boleh dibayar dengan martabat penerima.</h2>
          <ul>
            <li>Pastikan penerima memahami dan menyetujui ceritanya.</li>
            <li>Sensor data medis, dokumen, lokasi sensitif, dan identitas anak.</li>
            <li>Jelaskan kondisi selesai sebelum campaign diterbitkan.</li>
            <li>Jangan menjanjikan refund untuk dana yang sudah diterima penerima.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
