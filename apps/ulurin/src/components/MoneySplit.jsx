import { CheckCircle } from "@phosphor-icons/react";
import { calculateSplit, formatRupiah } from "../lib/finance.js";

export function MoneySplit({ split, amount, tier, compact = false, dark = false }) {
  const values = amount ? calculateSplit(amount, split) : null;
  const rows = [
    {
      key: "beneficiary",
      label: "Untuk penerima",
      detail: "Program dan kebutuhan penerima",
      percent: split.beneficiary,
      tone: "mint",
    },
    {
      key: "creator",
      label: "Imbalan Kreator",
      // Branch on the tier, not on the amount. Inferring "Tier 0" from a 0%
      // reward mislabels a verified creator who simply chose to take nothing —
      // the most generous case, described as the least trusted one.
      detail:
        tier === 0
          ? "Tier 0 tidak menerima imbalan"
          : split.creator === 0
            ? "Kreator memilih tidak mengambil imbalan"
            : "Kerja dan biaya lapangan",
      percent: split.creator,
      tone: "coral",
    },
    {
      key: "platform",
      label: "Ulurin",
      detail: "Operasional platform prototype",
      percent: split.platform,
      tone: "stone",
    },
  ];

  return (
    <div className={`money-split ${compact ? "money-split--compact" : ""} ${dark ? "money-split--dark" : ""}`}>
      {rows.map((row) => (
        <div className="money-split__row" key={row.key}>
          <span className={`money-split__marker money-split__marker--${row.tone}`} />
          <span className="money-split__copy">
            <strong>{row.label}</strong>
            {!compact ? <small>{row.detail}</small> : null}
          </span>
          <span className="money-split__value">
            <strong>{row.percent}%</strong>
            {values ? <small>{formatRupiah(values[row.key])}</small> : null}
          </span>
        </div>
      ))}
      {!compact ? (
        <p className="money-split__note">
          <CheckCircle size={16} weight="fill" />
          Total donasi sudah termasuk seluruh pembagian di atas.
        </p>
      ) : null}
    </div>
  );
}
