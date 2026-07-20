import { CheckCircle, Heart } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import { formatRupiah } from "../lib/finance.js";

export function ActivityTicker({ dark = false }) {
  const { activity } = useApp();

  return (
    <section className={`activity-ticker ${dark ? "activity-ticker--dark" : ""}`} aria-label="Aktivitas terkonfirmasi">
      <div className="activity-ticker__label">
        <span /> Aktivitas simulasi
      </div>
      <div className="activity-ticker__rail">
        {activity.slice(0, 5).map((item) => (
          <div className="activity-ticker__item" key={item.id}>
            {item.kind === "donation" ? <Heart size={16} weight="fill" /> : <CheckCircle size={16} weight="fill" />}
            {item.kind === "donation" ? (
              <span>
                {item.anonymous ? "Donatur anonim" : item.user} berdonasi {formatRupiah(item.amount)} ke {item.campaign}
              </span>
            ) : (
              <span>{item.user} mengonfirmasi bukti untuk {item.campaign}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
