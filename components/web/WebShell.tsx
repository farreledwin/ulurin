import Link from "next/link";
import type { ReactNode } from "react";

export default function WebShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="web-flow-page">
      <header className="web-flow-nav">
        <Link href="/web" className="web-flow-brand">
          <span>Ulurin</span>
          <small>Indonesia</small>
        </Link>
        <nav aria-label="Navigasi web">
          <Link href="/web/feed">Cerita Kebaikan</Link>
          <Link href="/web#campaigns">Campaign</Link>
          <Link href="/web/transparency">Transparansi</Link>
          <Link href="/web/you/kyc-tier">KYC tier</Link>
          <Link href="/web/circles/create">Mulai campaign</Link>
        </nav>
      </header>

      <main className="web-flow-main">
        <div className="web-flow-heading">
          <p className="web-flow-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
