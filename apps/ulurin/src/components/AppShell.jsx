import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useApp } from "../context/AppContext.jsx";
import { Header } from "./Header.jsx";
import { MobileNav } from "./MobileNav.jsx";

export function AppShell({ children, landing }) {
  const location = useLocation();
  const { toast, setToast } = useApp();

  // Deploy baru cuma menawarkan diri, tidak menculik halaman. updateServiceWorker()
  // kirim SKIP_WAITING -> SW baru ambil alih -> vite-plugin-pwa yang reload.
  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh: () =>
      setToast(
        <>
          Versi baru tersedia.{" "}
          <button type="button" className="toast__action" onClick={() => updateServiceWorker()}>
            Muat ulang
          </button>
        </>,
      ),
  });

  useEffect(() => {
    // A hash means "take me to this section" — honour it instead of jumping to
    // the top (the default for a plain route change). The rAF lets the target
    // page render before we look for the element.
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "instant" });
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // ponytail: toast non-string berarti ada tombol di dalamnya — biarkan sampai
    // user memutuskan. Yang string tetap hilang sendiri seperti sebelumnya.
    if (typeof toast !== "string" || !toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [setToast, toast]);

  return (
    <div className={`app-shell ${landing ? "app-shell--landing" : ""}`}>
      <Header overlay={landing} />
      <main>{children}</main>
      {/* Every screen, landing included. The nav used to vanish on "/", which
          left the app's own home page as the one place a phone user could not
          reach the app from — and made the bar feel like it came and went. */}
      <MobileNav />
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast ? <div className="toast">{toast}</div> : null}
      </div>
    </div>
  );
}
