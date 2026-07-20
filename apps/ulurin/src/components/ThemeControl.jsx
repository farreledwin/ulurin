import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";

// 3-way appearance control: Sistem (follow OS) / Terang / Gelap. A group of
// toggle buttons (aria-pressed) rather than an ARIA radiogroup — so it needs no
// arrow-key roving-tabindex handling and each option stays a normal Tab stop.
// Changing an option keeps focus on it (the account menu stays open). Reused by
// the desktop account menu and the mobile menu, so logged-out mobile visitors
// can pick a theme too.
const OPTIONS = [
  { key: "system", id: "Sistem", en: "System", Icon: Desktop },
  { key: "light", id: "Terang", en: "Light", Icon: Sun },
  { key: "dark", id: "Gelap", en: "Dark", Icon: Moon },
];

export function ThemeControl() {
  const { themePref, setThemePref, language } = useApp();
  const groupLabel = language === "id" ? "Tampilan" : "Appearance";

  return (
    <div className="theme-control">
      <span className="theme-control__label" id="theme-control-label">
        {groupLabel}
      </span>
      <div className="theme-control__seg" role="group" aria-labelledby="theme-control-label">
        {OPTIONS.map(({ key, id, en, Icon }) => {
          const active = themePref === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              className={`theme-control__opt ${active ? "is-active" : ""}`}
              onClick={() => setThemePref(key)}
            >
              <Icon size={15} weight={active ? "fill" : "regular"} aria-hidden="true" />
              <span>{language === "id" ? id : en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
