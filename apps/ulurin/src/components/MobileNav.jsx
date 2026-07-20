import { Compass, House, PlayCircle, UserCircle } from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Beranda", icon: House },
  { to: "/cerita", label: "Cerita", icon: PlayCircle },
  { to: "/jelajahi", label: "Jelajahi", icon: Compass },
  { to: "/dashboard", label: "Profil", icon: UserCircle },
];

export function MobileNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navigasi aplikasi">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to}>
          <Icon size={23} weight="regular" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
