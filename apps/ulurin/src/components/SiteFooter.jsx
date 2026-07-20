import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="wordmark" to="/">ULURIN</Link>
        <p>Menolong sesama, dijadikan profesi yang jujur.</p>
      </div>
      <div className="site-footer__links">
        <Link to="/cerita">Cerita</Link>
        <Link to="/jelajahi">Jelajahi</Link>
        <Link to="/transparansi">Transparansi</Link>
        <Link to="/dashboard">Untuk kreator</Link>
      </div>
      <p className="site-footer__honesty">
        Prototype lokal. Tidak menerima uang dan tidak terhubung ke Xendit produksi. Vault-nya nyata di
        Stellar Testnet dan bisa diperiksa publik; testnet XLM bukan uang sungguhan.
      </p>
    </footer>
  );
}
