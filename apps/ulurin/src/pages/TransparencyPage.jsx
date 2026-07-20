import {
  ArrowRight,
  ArrowSquareOut,
  CheckCircle,
  Coins,
  Cube,
  FileLock,
  Fingerprint,
  GlobeHemisphereEast,
  HandHeart,
  Info,
  Scales,
  ShieldCheck,
  Vault,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MoneySplit } from "../components/MoneySplit.jsx";
import { ProofTimeline } from "../components/ProofTimeline.jsx";
import { campaigns } from "../data/campaigns.js";
import { formatRupiah } from "../lib/finance.js";
import { useUsdcRate } from "../lib/useUsdcRate.js";
import { contractUrl } from "../lib/stellar.js";

export function TransparencyPage() {
  const campaign = campaigns[0];
  const sampleAmount = 100000;
  const { rate, source, live } = useUsdcRate();
  const [ledgerInfoOpen, setLedgerInfoOpen] = useState(false);
  const [custodyInfo, setCustodyInfo] = useState(null); // null | "xendit" | "soroban"

  return (
    <div className="transparency-page">
      <section className="transparency-hero page-gutter">
        <div>
          <h1>Transparansi bukan berarti mengaku tahu segalanya.</h1>
          <p>
            Ulurin memisahkan bukti perpindahan dana dari bukti bahwa bantuan benar-benar diterima dan berdampak.
            Keduanya penting. Keduanya tidak sama.
          </p>
        </div>
        <div className="transparency-hero__mark"><Fingerprint size={88} /></div>
      </section>

      <section className="proof-boundary page-gutter">
        <div className="proof-boundary__yes">
          <CheckCircle size={28} weight="fill" />
          <div className="proof-boundary__title">
            <h2>Yang dapat dibuktikan ledger</h2>
            <button
              className="ledger-info-trigger"
              type="button"
              aria-expanded={ledgerInfoOpen}
              aria-controls="ledger-info-panel"
              onClick={() => setLedgerInfoOpen((current) => !current)}
            >
              <Info size={18} />
              {ledgerInfoOpen ? "Tutup penjelasan" : "Apa itu ledger?"}
            </button>
          </div>
          {ledgerInfoOpen ? (
            <div
              className="ledger-info-panel"
              id="ledger-info-panel"
              role="region"
              aria-label="Penjelasan ledger"
            >
              <strong>Ledger adalah buku kas digital yang dapat dibaca publik.</strong>
              <p>
                Setiap donasi dan pencairan mencatat jumlah, waktu, akun pengirim, akun penerima,
                dan status transaksi. Setelah masuk ke jaringan Stellar, catatan itu sulit diubah diam-diam.
              </p>
              <p>
                Ledger menunjukkan aliran dana, tetapi tidak otomatis mengetahui identitas pemilik akun
                atau membuktikan bantuan sudah sampai. Karena itu Ulurin tetap membutuhkan verifikasi,
                invoice, konfirmasi penerima, dokumentasi, dan review manusia.
              </p>
            </div>
          ) : null}
          <ul>
            <li>Akun tertentu mengirim aset pada waktu tertentu.</li>
            <li>Kontrak menjalankan pembagian sesuai konfigurasi.</li>
            <li>Pencairan penerima dan kreator terjadi pada status yang tercatat.</li>
            <li>Hash bukti yang disimpan tidak berubah setelah dicatat.</li>
          </ul>
        </div>
        <div className="proof-boundary__no">
          <XCircle size={28} weight="fill" />
          <h2>Yang tidak otomatis terbukti</h2>
          <ul>
            <li>Identitas orang di balik suatu wallet.</li>
            <li>Invoice itu asli atau barang benar-benar dibeli.</li>
            <li>Obat, makanan, atau bantuan sampai ke orang yang tepat.</li>
            <li>Program menciptakan dampak seperti yang diklaim.</li>
          </ul>
        </div>
      </section>

      <section className="transparency-receipt section-shell page-gutter">
        <div className="section-heading section-heading--split">
          <div><span className="section-number">Receipt publik</span><h2>Satu campaign, dua lapis bukti.</h2></div>
          <p>Transaksi memberi jejak nilai. Review, konfirmasi penerima, moderasi, dan sengketa memberi konteks dunia nyata.</p>
        </div>
        <div className="transparency-receipt__grid">
          <div className="transparency-receipt__mock">
            <span>Contoh pembagian campaign</span>
            <h3>{campaign.shortTitle}</h3>
            <div className="transparency-receipt__total">
              <small>Total contoh donasi</small>
              <strong>{formatRupiah(sampleAmount)}</strong>
              <span>Jumlah penuh sebelum dibagi</span>
            </div>
            <MoneySplit split={campaign.split} amount={sampleAmount} tier={campaign.organizer.tier} />
            <div className="hash-panel">
              <span><small>Status</small><code>SIMULASI LOKAL · BUKAN TESTNET</code></span>
            </div>
          </div>
          <ProofTimeline />
        </div>
      </section>

      <section className="money-flow section-shell page-gutter">
        <div className="section-heading section-heading--split">
          <div><span className="section-number">Cara kerja uangnya</span><h2>Donatur lihat Rupiah. Di dalam, USDC yang jalan.</h2></div>
          <p>Crypto cuma pipa di belakang layar. Yang sudah live justru bagian paling penting: split-nya, dikunci kontrak on-chain.</p>
        </div>
        <div className="flow-rail">
          <span>&#9656; Donatur bayar Rp 100.000</span>
          <span>Penerima terima Rupiah di rekening &#9656;</span>
        </div>
        <ol className="flow-stages">
          <li className="flow-stage flow-stage--fiat">
            <span className="flow-stage__tag">1 &middot; On-ramp</span>
            <strong>Terima Rupiah</strong>
            <span className="flow-stage__who"><b>Xendit</b> · lisensi Bank Indonesia</span>
            <span className="flow-stage__chan">QRIS / VA / e-wallet</span>
          </li>
          <li className="flow-stage flow-stage--mitra">
            <span className="flow-stage__tag">2 &middot; Tukar</span>
            <strong>IDR &rarr; USDC</strong>
            <span className="flow-stage__who"><b>Exchange berlisensi</b> · Indodax / Pintu</span>
            <span className="flow-stage__chan">OJK · API exchange</span>
          </li>
          <li className="flow-stage flow-stage--live">
            <span className="flow-stage__badge">&#9679; Live testnet</span>
            <strong>Split 93/5/2</strong>
            <span className="flow-stage__who"><b>Vault Soroban</b> · dikunci, tak bisa diubah</span>
            <span className="flow-stage__chan">Stellar · on-chain</span>
          </li>
          <li className="flow-stage flow-stage--mitra">
            <span className="flow-stage__tag">4 &middot; Tukar</span>
            <strong>USDC &rarr; IDR</strong>
            <span className="flow-stage__who"><b>Exchange berlisensi</b> · settle wajib ke Rupiah</span>
            <span className="flow-stage__chan">OJK · API exchange</span>
          </li>
          <li className="flow-stage flow-stage--fiat">
            <span className="flow-stage__tag">5 &middot; Off-ramp</span>
            <strong>Kirim Rupiah</strong>
            <span className="flow-stage__who"><b>Xendit</b> · payout 140+ bank</span>
            <span className="flow-stage__chan">Disbursement API</span>
          </li>
        </ol>
        <p className="flow-note">Yang dilihat donatur &amp; penerima <strong>selalu Rupiah</strong>. Kurs USDC&rarr;IDR dibaca live dari exchange, ditampilkan apa adanya, dan dicatat di tiap receipt sebagai kurs saat donasi; crypto tidak pernah muncul di layar mereka.</p>
        <div className="flow-rate">
          <span className="flow-rate__label">Kurs USDC/IDR sekarang</span>
          <strong className="flow-rate__value">Rp {rate.toLocaleString("id-ID")} <span>/ USDC</span></strong>
          <span className="flow-rate__src">{live ? `${source} · dibaca live` : "kurs demo · fallback"}</span>
        </div>
        <div className="flow-band">
          <div className="flow-band__col flow-band__col--live">
            <span>Sudah live hari ini</span>
            <p>Split 93/5/2, <strong>maksimal 7% total</strong> (kreator &le;5% + platform 2%), dan escrow bukti jalan beneran di Stellar testnet — hash-nya bisa dicek siapa pun. Batas hukum PP No. 29/1980 adalah 10%; Ulurin berhenti di 7%.</p>
          </div>
          <div className="flow-band__col flow-band__col--need">
            <span>Butuh partner di produksi</span>
            <p>Konversi IDR&harr;USDC lewat <strong>exchange berlisensi OJK</strong>, dan rel Rupiah lewat <strong>Xendit</strong>. Di demo, ramp-nya simulasi berlabel — tapi {live ? <>kursnya <strong>dibaca live dari {source}</strong> (OJK), bukan angka tetap</> : "kursnya memakai fallback demo saat exchange tak terjangkau"}.</p>
          </div>
        </div>
        <p className="flow-foot"><strong>Ulurin = orkestrator, bukan kustodian dan bukan exchange.</strong> KYC/AML dan konversi legal ada di sisi partner berlisensi, bukan di kami.</p>
      </section>

      <section className="creator-fee section-shell page-gutter" aria-labelledby="creator-fee-heading">
        <div className="section-heading section-heading--split">
          <div><span className="section-number">Imbalan Kreator</span><h2 id="creator-fee-heading">Siapa Kreator Kebaikan, dan kenapa 5%.</h2></div>
          <p>Angka “5” di pembagian 93/5/2 bukan potongan platform. Itu imbalan untuk orang yang benar-benar mengerjakan bantuannya di lapangan — berikut siapa mereka, kenapa boleh sebanyak itu, dan dasar hukumnya.</p>
        </div>
        <div className="creator-fee__grid">
          <article className="creator-fee__card creator-fee__card--who">
            <HandHeart size={30} weight="light" />
            <span className="creator-fee__label">Siapa mereka</span>
            <h3>Orang yang menjalankan campaign, bukan perantara.</h3>
            <p>Kreator Kebaikan mensurvei lokasi, membeli kebutuhan, mengoordinasi warga atau relawan, lalu mendokumentasikan hasilnya. Kerja lapangan yang nyata — bukan sekadar menautkan rekening lalu menunggu.</p>
            <ul>
              <li>Wajah, rekam jejak, dan alasan imbalannya terlihat sebelum kamu berdonasi.</li>
              <li>Tiap campaign menuliskan sendiri untuk apa imbalan itu dipakai.</li>
            </ul>
          </article>
          <article className="creator-fee__card creator-fee__card--fee">
            <Coins size={30} weight="light" />
            <span className="creator-fee__label">Untuk apa 5% itu</span>
            <h3>Menutup kerja dan biaya lapangan yang nyata.</h3>
            <p>Transport, survei, koordinasi, operasional, dan penghargaan wajar atas waktu mereka. Tanpa ini, hanya orang yang mampu bekerja gratis yang bisa menggalang — dan itu mempersempit siapa yang boleh menolong.</p>
            <ul>
              <li>Bukan angka bebas: dibatasi tier verifikasi — 0% / 3% / 5%.</li>
              <li>Dikunci di kontrak on-chain saat campaign dibuat, tak bisa diubah diam-diam.</li>
              <li>Baru cair setelah bukti penyaluran diunggah dan direview.</li>
            </ul>
            <Link className="text-link" to="/tier">Lihat tangga tier lengkap <ArrowRight size={16} /></Link>
          </article>
        </div>
        <div className="creator-fee__law">
          <Scales size={24} />
          <div>
            <h3>Apakah ini legal? Ya — dan ada batasnya.</h3>
            <p>
              <strong>PP No. 29 Tahun 1980 Pasal 6 ayat (1)</strong> membatasi <em>pembiayaan usaha pengumpulan
              sumbangan sebanyak-banyaknya 10% dari hasil pengumpulan</em>. Yang dihitung adalah totalnya — imbalan
              kreator ditambah fee platform. Ulurin berhenti di <strong>7%</strong> (kreator &le;5% + platform 2%),
              dan kontrak menolak campaign yang melewati batas sebelum satu rupiah pun bergerak.
            </p>
            <p>
              Penggalangan dana publik sendiri wajib berizin di bawah <strong>UU No. 9 Tahun 1961</strong>, dan{" "}
              <strong>Permensos No. 8 Tahun 2021 Pasal 2 ayat (1)</strong> mewajibkannya dijalankan “dengan prinsip
              tertib, transparan, dan akuntabel”. Menampilkan pembagian dana sebelum kamu membayar, lalu mengunci
              imbalan sampai bukti direview, adalah cara kami memenuhi prinsip itu — bukan sekadar menaruh angka.
            </p>
            <div className="creator-fee__caveat">
              <Info size={15} />
              <span>
                Prototype ini belum mengantongi izin Kemensos. Yang di atas adalah kerangka hukum yang wajib dipenuhi
                versi produksinya — izin, KYC penuh, dan laporan pertanggungjawaban ada di daftar kerja, tidak kami
                klaim sudah selesai.
              </span>
            </div>
            <div className="creator-fee__sources">
              <span>Sumber</span>
              <a href="https://peraturan.bpk.go.id/Details/66625/pp-no-29-tahun-1980" target="_blank" rel="noopener noreferrer">PP 29/1980 <ArrowSquareOut size={13} /></a>
              <a href="https://peraturan.bpk.go.id/Details/51166/uu-no-9-tahun-1961" target="_blank" rel="noopener noreferrer">UU 9/1961 <ArrowSquareOut size={13} /></a>
              <a href="https://peraturan.bpk.go.id/Details/217212/permensos-no-8-tahun-2021" target="_blank" rel="noopener noreferrer">Permensos 8/2021 <ArrowSquareOut size={13} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="tech-stellar section-shell page-gutter" aria-labelledby="tech-stellar-heading">
        <div className="section-heading section-heading--split">
          <div><span className="section-number">Fondasi teknologi</span><h2 id="tech-stellar-heading">Kenapa Stellar &amp; Soroban.</h2></div>
          <p>Kami butuh rel nilai yang publik, murah, dan cepat — plus aturan pembagian yang tak bisa diubah diam-diam oleh siapa pun. Dua kebutuhan itu tepat jadi kekuatan Stellar.</p>
        </div>
        <div className="tech-stellar__grid">
          <article className="tech-card tech-card--stellar">
            <GlobeHemisphereEast size={30} weight="light" />
            <span className="tech-card__label">Stellar · jaringan</span>
            <h3>Buku kas publik untuk memindahkan nilai.</h3>
            <p>
              Stellar adalah blockchain terbuka yang dirancang khusus untuk pembayaran. Setiap perpindahan dana
              tercatat di ledger yang bisa dibaca dan diaudit siapa pun, selesai dalam hitungan detik, dengan biaya
              jaringan sepersekian sen — jadi ongkos tidak menggerus donasi.
            </p>
            <ul>
              <li>Catatan transaksi publik, sulit diubah diam-diam.</li>
              <li>Membawa USDC (stablecoin) yang nilainya menempel ke dolar, bukan koin spekulatif.</li>
              <li>Perannya cuma rel pemindah nilai — bukan tempat berspekulasi.</li>
            </ul>
          </article>
          <article className="tech-card tech-card--soroban">
            <Cube size={30} weight="light" />
            <span className="tech-card__label">Soroban · smart contract</span>
            <h3>Pembagian 93/5/2 dikunci oleh kode, bukan janji.</h3>
            <p>
              Soroban adalah platform smart contract di Stellar. Aturan split Ulurin hidup sebagai kontrak on-chain
              (vault): begitu donasi masuk, kontrak yang membaginya otomatis sesuai konfigurasi —{" "}
              <strong>tidak ada pihak, termasuk Ulurin, yang bisa menggeser porsinya diam-diam</strong>. Perubahan apa
              pun harus lewat kode yang publik.
            </p>
            <ul>
              <li><strong>Dana (USDC) ditahan kontrak vault-nya sendiri di Stellar</strong> — bukan di rekening Ulurin; porsi penerima, Kreator, dan platform tercatat on-chain.</li>
              <li>Aturan pembagian = kode, transparan dan permanen.</li>
              <li>Imbalan Kreator tetap terkunci sampai bukti diunggah dan direview.</li>
              <li>Hash bukti disimpan on-chain, tak berubah setelah dicatat.</li>
            </ul>
          </article>
        </div>
        <div className="tech-custody">
          <div className="tech-custody__head">
            <Vault size={22} />
            <h3>Di mana dana ditahan?</h3>
          </div>
          <div className="tech-custody__info">
            <button type="button" className="ledger-info-trigger" aria-expanded={custodyInfo === "xendit"} aria-controls="info-xendit" onClick={() => setCustodyInfo((cur) => (cur === "xendit" ? null : "xendit"))}>
              <Info size={15} /> Apa itu Xendit?
            </button>
            <button type="button" className="ledger-info-trigger" aria-expanded={custodyInfo === "soroban"} aria-controls="info-soroban" onClick={() => setCustodyInfo((cur) => (cur === "soroban" ? null : "soroban"))}>
              <Info size={15} /> Apa itu Soroban?
            </button>
            <button type="button" className="ledger-info-trigger" aria-expanded={custodyInfo === "usdc"} aria-controls="info-usdc" onClick={() => setCustodyInfo((cur) => (cur === "usdc" ? null : "usdc"))}>
              <Info size={15} /> Apa itu USDC?
            </button>
            <button type="button" className="ledger-info-trigger" aria-expanded={custodyInfo === "testnet"} aria-controls="info-testnet" onClick={() => setCustodyInfo((cur) => (cur === "testnet" ? null : "testnet"))}>
              <Info size={15} /> Apa itu testnet?
            </button>
            <button type="button" className="ledger-info-trigger" aria-expanded={custodyInfo === "qris"} aria-controls="info-qris" onClick={() => setCustodyInfo((cur) => (cur === "qris" ? null : "qris"))}>
              <Info size={15} /> Apa itu QRIS?
            </button>
            <button type="button" className="ledger-info-trigger" aria-expanded={custodyInfo === "va"} aria-controls="info-va" onClick={() => setCustodyInfo((cur) => (cur === "va" ? null : "va"))}>
              <Info size={15} /> Apa itu Virtual Account?
            </button>
          </div>
          {custodyInfo === "xendit" ? (
            <div className="ledger-info-panel tech-custody__panel" id="info-xendit" role="region" aria-label="Penjelasan Xendit">
              <strong>Xendit — gerbang pembayaran (payment gateway) berlisensi di Indonesia.</strong>
              <p>Diawasi Bank Indonesia. Xendit yang menerima Rupiah dari donatur (QRIS, Virtual Account, e-wallet, kartu) dan mengirim Rupiah ke rekening penerima. Ulurin memakainya sebagai rel fiat — Ulurin sendiri tidak menyimpan uangmu.</p>
            </div>
          ) : null}
          {custodyInfo === "soroban" ? (
            <div className="ledger-info-panel tech-custody__panel" id="info-soroban" role="region" aria-label="Penjelasan Soroban">
              <strong>Soroban — platform smart contract di jaringan Stellar.</strong>
              <p>“Vault” Ulurin adalah program Soroban yang menahan USDC dan membaginya 93/5/2 secara otomatis. Aturannya berupa kode publik yang tak bisa diubah diam-diam, dan tiap transaksinya bisa dicek di Stellar Expert.</p>
            </div>
          ) : null}
          {custodyInfo === "usdc" ? (
            <div className="ledger-info-panel tech-custody__panel" id="info-usdc" role="region" aria-label="Penjelasan USDC">
              <strong>USDC — “stablecoin” yang nilainya dipatok ke dolar AS (1 USDC ≈ 1 USD).</strong>
              <p>Diterbitkan Circle. Karena stabil, USDC dipakai sebagai satuan settlement di dalam vault — bukan koin yang harganya naik-turun seperti kripto pada umumnya. Donatur dan penerima tidak pernah melihatnya; di layar tetap Rupiah.</p>
            </div>
          ) : null}
          {custodyInfo === "testnet" ? (
            <div className="ledger-info-panel tech-custody__panel" id="info-testnet" role="region" aria-label="Penjelasan testnet">
              <strong>Testnet — jaringan uji Stellar.</strong>
              <p>Mirip jaringan asli, tapi token-nya token uji tanpa nilai — untuk membangun dan menguji dengan aman. Semua yang Ulurin jalankan sekarang (vault, split, hash) ada di testnet: kode dan bukti on-chain-nya nyata, tapi bukan uang sungguhan. Di produksi, pindah ke jaringan utama (mainnet).</p>
            </div>
          ) : null}
          {custodyInfo === "qris" ? (
            <div className="ledger-info-panel tech-custody__panel" id="info-qris" role="region" aria-label="Penjelasan QRIS">
              <strong>QRIS (Quick Response Code Indonesian Standard) — standar QR pembayaran nasional dari Bank Indonesia.</strong>
              <p>Satu kode QR bisa dibayar pakai aplikasi apa pun — GoPay, OVO, DANA, ShopeePay, atau m-banking mana saja. Donatur tinggal scan lalu bayar dalam Rupiah; tidak perlu tahu aplikasi apa yang dipakai penerima.</p>
            </div>
          ) : null}
          {custodyInfo === "va" ? (
            <div className="ledger-info-panel tech-custody__panel" id="info-va" role="region" aria-label="Penjelasan Virtual Account">
              <strong>Virtual Account (VA) — nomor rekening virtual unik untuk tiap transaksi.</strong>
              <p>Donatur transfer Rupiah ke nomor itu lewat m-banking atau ATM bank mana pun. Karena nomornya khusus untuk satu pembayaran, dana cocok otomatis dan terverifikasi tanpa konfirmasi manual — tidak perlu unggah bukti transfer.</p>
            </div>
          ) : null}
          <ol className="tech-custody__steps">
            <li>
              <span className="tech-custody__tag">Rupiah masuk</span>
              <p>Ditahan <strong>Xendit</strong> (berlisensi Bank Indonesia) — belum menyentuh Ulurin.</p>
            </li>
            <li className="tech-custody__steps--pool">
              <span className="tech-custody__tag">Selama on-chain · kolamnya</span>
              <p><strong>USDC ditahan kontrak vault Soroban</strong> di Stellar. Kontrak yang memegang dan membaginya — bukan Ulurin. Porsi penerima, Kreator, dan platform tercatat di kontrak.</p>
            </li>
            <li>
              <span className="tech-custody__tag">Cair keluar</span>
              <p>Kembali jadi <strong>Rupiah</strong>, dikirim ke rekening penerima lewat Xendit.</p>
            </li>
          </ol>
          <p className="tech-custody__foot"><strong>Ulurin tidak pernah memegang dana.</strong> Kami orkestrator — bukan kustodian, bukan exchange. Kolam dana ada di kontrak on-chain (bisa dicek di Stellar Expert), fiat-nya di partner berlisensi.</p>
        </div>
        <ul className="tech-stellar__facts" aria-label="Ciri jaringan Stellar">
          <li><strong>~5 detik</strong><span>transaksi final di jaringan</span></li>
          <li><strong>&lt; 1 sen</strong><span>biaya jaringan per transaksi</span></li>
          <li><strong>Publik</strong><span>ledger bisa dicek siapa pun</span></li>
          <li><strong>Terkunci</strong><span>split dijaga smart contract</span></li>
        </ul>
        <a className="text-link tech-stellar__cta" href={contractUrl} target="_blank" rel="noopener noreferrer">
          Lihat kontrak vault 93/5/2 &amp; transaksinya di Stellar Expert <ArrowSquareOut size={16} />
        </a>
        <p className="tech-stellar__foot">
          <Info size={15} />
          <span>
            Sekarang berjalan di <strong>Stellar testnet</strong> — nilainya token uji, bukan uang sungguhan. Di
            produksi, USDC dijembatani exchange berlisensi (lihat “Cara kerja uangnya” di atas). Bagi donatur dan
            penerima, yang tampil di layar tetap Rupiah.
          </span>
        </p>
      </section>

      <section className="release-explainer page-gutter">
        <div className="release-explainer__copy">
          <span className="section-number">Urutan pencairan</span>
          <h2>Penerima tidak perlu menunggu konten selesai dibuat.</h2>
          <p>
            Bagian penerima tersedia lebih dulu. Imbalan Kreator tetap terkunci sampai bukti diunggah dan direview.
            Ini menjaga urgensi bantuan tanpa menghapus kewajiban melapor.
          </p>
        </div>
        <div className="release-explainer__steps">
          <div><span>01</span><ShieldCheck size={23} /><strong>Donasi dikonfirmasi</strong><small>Pembagian sudah diketahui sejak checkout.</small></div>
          <div><span>02</span><CheckCircle size={23} /><strong>Penerima lebih dulu</strong><small>Bantuan tidak digerbang oleh proses dokumentasi.</small></div>
          <div><span>03</span><FileLock size={23} /><strong>Imbalan terkunci</strong><small>Kreator melengkapi bukti dan menunggu review.</small></div>
        </div>
      </section>

      <section className="transparency-honesty page-gutter">
        <WarningCircle size={31} />
        <div>
          <h2>Batas yang diakui adalah alasan untuk percaya.</h2>
          <p>
            Smart contract tidak menggantikan hukum, lisensi, KYC, perlindungan konsumen, moderasi, atau penilaian manusia.
            Prototype ini memakai data lokal dan tidak mengklaim sebaliknya.
          </p>
        </div>
        <Link className="button button--outline-light" to="/jelajahi">Lihat campaign <ArrowRight size={17} /></Link>
      </section>
    </div>
  );
}
