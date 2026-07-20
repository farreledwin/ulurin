import { SignOut } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { formatRupiah } from "../lib/finance.js";
import { ThemeControl } from "./ThemeControl.jsx";

const initialOf = (email) => (email ? email.trim().charAt(0).toUpperCase() : "U");
const FALLBACK_RATE = 16000; // matches api/rate.js demo rate

// The signed-in account menu in the header: an avatar-initial button opening a
// disclosure dropdown (identity + Dashboard + appearance/language + Keluar). It
// replaces the lone "Dashboard" link and makes logout + the theme toggle reachable
// from every page, not only the dashboard. Disclosure pattern (NOT role=menu): the
// items are ordinary focusable links/buttons in tab order. Enter/Space open;
// Esc closes and returns focus to the trigger; it also closes on outside
// pointerdown and when focus leaves the panel.
export function AccountMenu() {
  const { session, signOut, language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  // Rate is fetched lazily the FIRST time the menu opens (not on every page load
  // for every signed-in user), only to show the balance in Rupiah. Demo rate on
  // failure — the balance is a soft, secondary detail here.
  useEffect(() => {
    if (!open || rate !== null) return undefined;
    let alive = true;
    fetch("/api/rate")
      .then((r) => r.json())
      .then((d) => alive && setRate(Number(d.rate) || FALLBACK_RATE))
      .catch(() => alive && setRate(FALLBACK_RATE));
    return () => {
      alive = false;
    };
  }, [open, rate]);

  // Close on outside pointerdown, and when focus leaves the menu entirely (Tab
  // out) — but not on a bare blur, which would fire before an inner click lands.
  useEffect(() => {
    if (!open) return undefined;
    const root = rootRef.current;
    const onPointerDown = (event) => {
      if (root && !root.contains(event.target)) setOpen(false);
    };
    const onFocusOut = () => {
      requestAnimationFrame(() => {
        if (root && !root.contains(document.activeElement)) setOpen(false);
      });
    };
    document.addEventListener("pointerdown", onPointerDown);
    root?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      root?.removeEventListener("focusout", onFocusOut);
    };
  }, [open]);

  const closeToTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  const onKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      closeToTrigger();
    }
  };

  const email = session.email ?? "";
  const balance = rate !== null ? formatRupiah(Math.round(Number(session.usdc ?? 0) * rate)) : null;
  const triggerLabel = language === "id" ? "Akun dan pengaturan" : "Account and settings";

  return (
    <div className="account-menu" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className="account-menu__trigger"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={triggerLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="account-menu__avatar" aria-hidden="true">
          {initialOf(email)}
        </span>
      </button>

      {open ? (
        <div className="account-menu__panel" id={menuId}>
          <Link className="account-menu__identity" to="/dashboard" onClick={() => setOpen(false)}>
            <span className="account-menu__avatar account-menu__avatar--lg" aria-hidden="true">
              {initialOf(email)}
            </span>
            <span className="account-menu__id-text">
              <span className="account-menu__email">{email || "Akun"}</span>
              <span className="account-menu__badges">
                <span className="account-menu__badge">Demo testnet</span>
                {balance ? <span className="account-menu__saldo">Saldo {balance}</span> : null}
              </span>
            </span>
          </Link>

          <div className="account-menu__sep" />

          <Link className="account-menu__row" to="/dashboard" onClick={() => setOpen(false)}>
            {language === "id" ? "Dashboard Kreator" : "Creator dashboard"}
          </Link>

          <div className="account-menu__sep" />

          <div className="account-menu__control">
            <ThemeControl />
          </div>
          <div className="account-menu__control account-menu__control--row">
            <span className="theme-control__label">{language === "id" ? "Bahasa" : "Language"}</span>
            <div className="lang-seg" role="group" aria-label={language === "id" ? "Bahasa" : "Language"}>
              <button
                type="button"
                aria-pressed={language === "id"}
                className={`lang-seg__opt ${language === "id" ? "is-active" : ""}`}
                onClick={() => setLanguage("id")}
              >
                ID
              </button>
              <button
                type="button"
                aria-pressed={language === "en"}
                className={`lang-seg__opt ${language === "en" ? "is-active" : ""}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
            </div>
          </div>

          <div className="account-menu__sep" />

          <button
            type="button"
            className="account-menu__row account-menu__row--signout"
            onClick={() => {
              setOpen(false);
              signOut();
              // signOut nulls the session, which unmounts this whole menu — move
              // focus to the "Masuk" link that replaces it so keyboard users
              // aren't dropped to <body>.
              requestAnimationFrame(() => document.querySelector(".header-signin")?.focus());
            }}
          >
            <SignOut size={16} aria-hidden="true" /> {language === "id" ? "Keluar" : "Sign out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
