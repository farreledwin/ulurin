import { List, SignOut, X } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { AccountMenu } from "./AccountMenu.jsx";
import { SimulationNotice } from "./SimulationNotice.jsx";
import { ThemeControl } from "./ThemeControl.jsx";

export function Header({ overlay = false }) {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t, session, signOut } = useApp();

  const links = [
    { to: "/cerita", label: t.story },
    { to: "/jelajahi", label: t.explore },
    { to: "/transparansi", label: t.transparency },
  ];

  return (
    <header className={`site-header ${overlay ? "site-header--overlay" : ""}`}>
      <div className="site-header__inner">
        <Link className="wordmark" to="/" aria-label="Ulurin beranda">
          ULURIN
        </Link>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="language-switch"
            type="button"
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            aria-label="Ganti bahasa"
          >
            {language === "id" ? "ID" : "EN"}
          </button>
          <SimulationNotice />
          {session ? (
            <AccountMenu />
          ) : (
            <Link className="header-signin" to="/dashboard">
              {t.login}
            </Link>
          )}
          <button
            className="mobile-menu-button"
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="mobile-menu" aria-label="Navigasi mobile">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/dashboard" onClick={() => setOpen(false)}>
            {t.dashboard}
          </NavLink>
          <ThemeControl />
          {session ? (
            <button
              type="button"
              className="mobile-menu__signout"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              <SignOut size={16} aria-hidden="true" /> {language === "id" ? "Keluar" : "Sign out"}
            </button>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
