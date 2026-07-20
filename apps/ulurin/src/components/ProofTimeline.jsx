import { Check, Clock, FileText, HandHeart, Receipt } from "@phosphor-icons/react";

const steps = [
  {
    icon: Receipt,
    title: "Invoice",
    copy: "Pengeluaran dicatat dan file aslinya disimpan.",
  },
  {
    icon: HandHeart,
    title: "Konfirmasi penerima",
    copy: "Penerima atau lembaga mengakui bantuan yang diterima.",
  },
  {
    icon: FileText,
    title: "Transaksi publik",
    copy: "Ringkasan perpindahan dana dapat diperiksa secara independen.",
  },
];

export function ProofTimeline({ compact = false }) {
  return (
    <div className={`proof-timeline ${compact ? "proof-timeline--compact" : ""}`}>
      {steps.map(({ icon: Icon, title, copy }, index) => (
        <div className="proof-step" key={title}>
          <div className="proof-step__icon"><Icon size={24} /></div>
          <div>
            <span>0{index + 1}</span>
            <strong>{title}</strong>
            {!compact ? <p>{copy}</p> : null}
          </div>
          {index < steps.length - 1 ? (
            <span className="proof-step__connector"><Check size={13} weight="bold" /></span>
          ) : (
            <span className="proof-step__connector proof-step__connector--last"><Clock size={13} /></span>
          )}
        </div>
      ))}
    </div>
  );
}
