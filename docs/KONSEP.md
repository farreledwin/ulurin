# Ulurin: Konsep & Alignment Stellar

🌐 **Bahasa:** Bahasa Indonesia (dokumen ini) · [English](KONSEP.en.md)

> Dokumen konsep produk. Status: konsep + MVP testnet.
> Catatan jujur dipegang di seluruh dokumen: angka demo/testnet dilabeli, tidak
> ada metrik fiktif, tidak mengklaim "pertama di dunia", dan tidak mengklaim
> afiliasi dengan Stellar/SDF/Stellar Aid Assist.

> **English:** a full English version of this document is at
> [`KONSEP.en.md`](KONSEP.en.md). The body below is in Indonesian because its market,
> cases, and cultural context (zakat, the Cak Budi and ACT scandals, grassroots
> movements) are Indonesia-specific.

---

## 1. Ringkasan

**Satu kalimat:** Platform di mana menolong orang jadi profesi yang jujur.
Kreator Kebaikan mengangkat kasus nyata lewat cerita (video dan/atau foto), menyalurkan
bantuannya, dan berhak atas imbalan yang transparan dan berbatas (0-10%),
sementara tiap rupiah bisa dibuktikan on-chain.

**Tagline:** *"Berbuat baik, jadi pekerjaan."*

**Elevator (buat investor/juri):** Kitabisa dan sejenisnya sudah membuktikan
orang mau berdonasi online, tapi penggalang bekerja gratis/tak diakui dan
kepercayaan bersifat off-chain (percaya laporan). Ulurin memprofesikan peran
penggalang dengan imbalan transparan berbatas, menjadikannya cerita native (video/foto), dan membuktikan tiap rupiah lewat Stellar. Kami membawa model bantuan
transparan yang sudah dibuktikan Stellar Aid Assist di level lembaga, turun ke
akar rumput: donor biasa ke penerima nyata.

## 2. Visi & Misi

**Visi:** Masa depan di mana berbuat baik bisa jadi pekerjaan utama. Siapa pun
bisa hidup dari menolong sesama, dan setiap kebaikan bisa dibuktikan, bukan
sekadar dipercaya.

**Misi:**
1. Memprofesikan menolong: panggung + penghasilan transparan bagi Kreator Kebaikan.
2. Donasi tanpa friksi, tanpa keraguan: tersentuh langsung bisa bantu di layar yang sama, langsung dapat bukti.
3. Menjaga martabat penerima: diceritakan sebagai manusia yang punya rencana, bukan objek iba.
4. Membuktikan tiap rupiah sampai: escrow + receipt publik, menutup luka Cak Budi dan ACT.

**Istilah (penting, tiga lapisan, bukan saling gantikan):**
- **Philanthropreneur** = gerakan/visi + kategori yang Ulurin bangun: dunia di mana berbuat baik jadi profesi berkelanjutan. Ini positioning perusahaan + ekosistemnya (Ulurin = perusahaan philanthropreneur).
- **Kreator Kebaikan** = peran orangnya di dalam app (yang mengangkat, verifikasi, cerita, salurkan). Kreator Kebaikan adalah philanthropreneur dalam praktik.
- Jadi: visi kami mendorong **gerakan philanthropreneur**; yang orang "jadi" di app-nya adalah **Kreator Kebaikan**; Ulurin adalah **platform philanthropreneur**.

### Masalah asal yang Ulurin selesaikan (kasus nyata, bersumber)

Misi #4 ("menutup luka Cak Budi dan ACT") berakar pada dua kasus nyata yang
membuktikan: **masalahnya bukan "dibayar untuk berbuat baik", tapi "tersembunyi
dan tanpa batas".** Itu yang Ulurin selesaikan.

**Cak Budi (2017), skala perorangan.** Penggalang donasi terkenal di media sosial
mengumpulkan **~Rp 1,2 miliar**, lalu memakainya untuk **Toyota Fortuner + iPhone 7**.
Ia mengaku, menjual mobilnya, dan mentransfer hasilnya ke ACT. Bukan penjahat,
tapi **tidak ada jalur jujur**: tidak ada pengungkapan di depan berapa yang jadi
haknya. ([Detik, 2017](https://news.detik.com/berita/d-3488851/heboh-pengakuan-cak-budi-pakai-uang-donasi-untuk-beli-fortuner))

**ACT (2022), skala lembaga.**
- Dari **Rp 138,5 miliar** dana Boeing (Community Investment Fund) untuk keluarga korban **Lion Air JT610** (Boeing 737 MAX, jatuh 2018, 189 tewas), hanya **Rp 20,5 miliar** yang benar-benar dipakai sesuai tujuan (6 dari 70 program). Petinggi ACT divonis 3-3,5 tahun (2023). ([VOI](https://voi.id/en/news/247120) · [BenarNews](https://www.benarnews.org/english/news/indonesian/indonesia-embezzlement-01242023130425.html))
- Secara umum, PPATK menemukan **lebih dari 50% dari Rp 1,7 triliun (US$113,9 juta)** donasi mengalir ke entitas terafiliasi petinggi; ACT memotong **13,7%** (di atas batas legal **10%** yayasan); izin PUB dicabut Kemensos (Jul 2022). ([The Jakarta Post](https://www.thejakartapost.com/indonesia/2022/08/05/more-than-half-of-act-donations-went-into-execs-pockets-investigators-say.html) · [Kompas](https://nasional.kompas.com/read/2022/07/06/13183861/izin-act-dicabut-karena-dugaan-penyelewengan-dana-bagaimana-aturan-donasi-di))

**Benang merahnya (yang Ulurin jawab):** dua-duanya soal **potongan yang
tersembunyi, tanpa batas, tanpa bukti.** Ulurin menjawab persis itu: cut
**diungkap di depan + capped 0-10% + di-enforce kontrak**, dana **escrow**, dan
**alur uang tercatat on-chain**. Inilah arti "menutup luka Cak Budi dan ACT".

## 3. Konsep inti (dan beda dari Kitabisa)

Kitabisa/sejenisnya: iklan di IG/TikTok Reels lalu CTA ke web; penggalang sering
relawan tak dibayar; kepercayaan off-chain. **Ulurin menambahkan tiga hal:**

- **Segmen cerita native** (feed **Cerita Kebaikan = video dan/atau foto**, bukan cuma iklan lempar ke web). Video maupun foto dua-duanya boleh; Kreator pilih format yang paling pas untuk kasusnya.
- **Kreator Kebaikan dibayar transparan** (0-10%, di-enforce kontrak): menolong jadi profesi.
- **Bukti on-chain** (donasi + penyaluran tercatat, bisa dicek siapa pun tanpa login).

Fokus MVP = SATU fungsi ini (donasi kreator-cut + cerita video/foto + bukti).
Fitur lanjutan (donasi rutin, zakat, kurasi CSR) ditahan dulu agar fokus dan
scope MVP tetap realistis.

**Siapa yang bisa dibantu (dua jenis penerima):**
- **Perorangan / kasus** (sekali jalan): operasi tanpa biaya, kecelakaan, obat, lansia terlantar, hewan sakit/terlantar (bukan cuma peliharaan), **biaya bantuan hukum untuk orang tak mampu / terdzolimi** (mis. korban yang tak sanggup bayar pengacara), **pekerja informal yang kehilangan nafkah** (mis. driver ojol yang motornya hilang/dicuri, meninggal karena kelelahan kerja, atau sakit dan tak bisa bekerja lagi, sehingga keluarganya kehilangan penghasilan), dll.
- **Organisasi / yayasan** (butuh donatur rutin): rumah yatim piatu, shelter hewan, panti jompo, yayasan kanker, yayasan rehab, gerakan anti-kekerasan seksual (mis. mendanai psikolog/psikiater profesional), lembaga bantuan hukum (LBH), dan lembaga sosial lain.
- **Bencana alam** (kampanye darurat): banjir, gempa, erupsi, dsb, penggalangan cepat berskala besar. Ini format yang **paling nyambung dengan Stellar Aid Assist** (bantuan krisis cepat + transparan).

Intinya: penerima bisa individu ATAU organisasi, dan model bantuannya bisa
**sekali** atau **rutin (recurring)**. Catatan teknis: donasi rutin butuh
penjadwal off-chain (Stellar tidak punya scheduler native) yang men-submit
pembayaran on-chain terjadwal, jadi ini fitur fast-follow, bukan wajib hari-1
MVP. Prinsip verifikasi + escrow + bukti on-chain tetap sama untuk keduanya.

## 3.1 Ukuran pasar (bukti: kenapa ini bisnis besar)

Riset bersumber, diakses 2026-07-11. Angka "potensi" dilabeli sebagai estimasi resmi.

| Angka | Nominal | Tahun | Sumber |
|---|---|---|---|
| ZIS terkumpul nasional (formal, BAZNAS + LAZ) | **Rp 40,5 triliun** (+25% YoY) | 2024 | [BAZNAS LPZ 2024](https://baznas.go.id/assets/images/szn/LPZ%20Nasional%20Akhir%20Tahun%202024.pdf) |
| **Potensi zakat nasional** (estimasi) | **Rp 327,6 triliun/th**, baru ~10% tergarap | 2023-24 | [Kemenag](https://kemenag.go.id/nasional/potensi-mencapai-327-t-ini-tiga-fokus-kemenag-dalam-pengembangan-zakat-LobJF) · [Kompas](https://www.kompas.id/artikel/en-potensi-zakat-rp-327-triliun-yang-terkumpul-baru-rp-41-triliun) |
| **Potensi total filantropi ID** (estimasi Bappenas) | **Rp 650-665 triliun/th** | 2025 | [CNBC Indonesia](https://www.cnbcindonesia.com/news/20250804121649-4-654804/bappenas-potensi-filantropi-ri-capai-rp-6655-triliun-per-tahun) |
| Pemberian ZISWAF aktual (survei, termasuk informal) | **~Rp 343 triliun/th** | 2026 | [PUSKAS/STF UIN Jakarta](https://www.stfuinjakarta.org/2026/06/07/press-release-survei-nasional-ziswaf-2026-angka-ziswaf-nasional-mencapai-rp343-triliun/) |
| Kitabisa.com (disalurkan) | **Rp 830 miliar · 8 juta donatur** | 2024 | [Kitabisa](https://kitabisa.com/about-us) |
| ACT sebelum skandal | **Rp 519 miliar** (2020); **~Rp 2 triliun** kumulatif; **Rp 450 miliar dipotong** (temuan Polri) | 2020/2022 | [Tempo](https://www.tempo.co/politik/aksi-cepat-tanggap-himpun-dana-ratusan-miliar-ini-detailnya-328957) · [Antara/Polri](https://www.antaranews.com/berita/3027249/polri-temukan-fakta-act-potong-donasi-masyarakat-rp450-miliar) |
| Indonesia = **negara paling dermawan sedunia, 7 tahun beruntun** (90% berdonasi) | konteks | 2024 (CAF) | [CAF World Giving Index](https://www.cafonline.org/home/about-us/press-office/indonesia-retains-top-place-in-world-giving-index-with-ukraine-climbing-to-second-most-generous-country) |

**Wow-pairing buat pitch:** potensi zakat **Rp 327T** vs baru **~Rp 40T** tergarap
= **~90% pasar belum tersentuh**, dan channel formal tumbuh 25-44%/tahun. Dari
~Rp 343T pemberian aktual, **~88% masih di luar rel formal** dan nyaris belum digital.

**Kenapa "philanthropreneur" itu nyata (bukan fantasi), konvergensi 2 fakta:**
- Penggalang dana **hari ini kerja gratis** (relawan, potongan 0%; mis. berbuatbaik.id "dana 100% disalurkan"). Yang bekerja mengumpulkan, tidak mendapat apa-apa.
- Tapi orang **sudah terbukti mau membayar kreator langsung**: Trakteer **500rb+ kreator, 4 juta supporter**; Saweria estimasi **Rp 700jt-1 miliar/bulan** ([teknologi.id](https://teknologi.id/business/trakteer-dan-saweria-platform-crowdfunding-terlaris-untuk-support-content-creator)).
- Ulurin = pertemuan keduanya: **permintaan donor terbukti + kemauan bayar kreator terbukti + tenaga penggalang yang belum dibayar.** Itu celah yang diprofesikan model philanthropreneur.

**Hook "kenapa blockchain":** ACT, platform **Rp 2 triliun** yang **memotong Rp 450
miliar dana umat** (temuan Polri). Luka kepercayaan konkret yang dijawab langsung
oleh custody transparan on-chain.

**Catatan jujur:** "potensi" = estimasi resmi (BAZNAS/Bappenas), bukan yang
benar-benar terkumpul. Rumah Zakat tidak dikutip angkanya (data di balik PDF,
belum terverifikasi). Trakteer/Saweria = angka platform/sekunder.

## 3.2 Fase berikutnya: zakat (target market + kenapa perlu ada)

Donasi umum (cerita video/foto + creator cut) adalah MVP. **Zakat adalah ekspansi alami**
setelah rel dan kepercayaan terbukti.

**Kenapa zakat cocok banget dengan model Ulurin:**
- Zakat itu **kewajiban** (rukun Islam), jadi arus **rutin + kultural** yang masif dan berulang tiap tahun, dengan lonjakan besar saat Ramadan. Bukan donasi sukarela sesekali.
- **Potensi Rp 327,6 triliun/tahun, baru ~10% (~Rp 40T) tergarap formal** ([Kompas](https://www.kompas.id/artikel/en-potensi-zakat-rp-327-triliun-yang-terkumpul-baru-rp-41-triliun)) → ~90% masih diberikan langsung/informal tanpa jejak. Pasar raksasa yang belum terlayani teknologi transparan.
- Peran **amil** (pengumpul + penyalur zakat) berhak bagian sampai **12,5%** (DSN-MUI). Itu **persis** model "Kreator Kebaikan berbayar transparan + capped". Zakat justru menuntut cap + transparansi yang di-enforce kontrak.
- **Digital zakat sedang tumbuh:** BAZNAS menargetkan **30% zakat via digital**; digitalisasi bisa menaikkan efisiensi pengumpulan hingga **45%** (studi akademik).

**Target market zakat:**
- 200 juta+ Muslim Indonesia. Cakupan: zakat maal, zakat fitrah, infak, sedekah, wakaf.
- Frekuensi tinggi + recurring (tahunan + spike Ramadan), lintas kelas, sudah jadi kebiasaan.
- **Amil/lembaga** (LAZ, masjid, komunitas) sebagai Kreator terverifikasi yang menyalurkan secara transparan.

**Kenapa perlu ada ke depan:** kepercayaan ke lembaga zakat formal tergerus
(kasus ACT memotong Rp 450 miliar), sementara mayoritas orang menyalurkan zakat
langsung/informal tanpa bukti. Ulurin bisa jadi **rel zakat yang membuktikan
tiap rupiah sampai + memberi amil imbalan yang halal, transparan, dan berbatas.**
Menutup gap kepercayaan dan gap digitalisasi sekaligus.

**Catatan jujur (penting):** zakat = ranah syariah + regulasi. Butuh **kepatuhan
syariah** (fatwa DSN-MUI, aturan amil) dan kemungkinan **kemitraan/registrasi
dengan LAZ resmi**. Ulurin jangan mengklaim jadi otoritas zakat; posisikan
sebagai **alat penyaluran zakat transparan** (untuk/bersama amil dan LAZ
terdaftar). Ini FASE BERIKUTNYA, bukan MVP.

## 3.3 Kolaborasi gerakan (Pandawara dll): dari sponsor sesekali ke pendapatan rutin

Ada pola berulang di Indonesia: **gerakan kebaikan yang kaya follower tapi tidak
stabil pendapatannya**, karena bergantung sponsor/CSR yang datang-pergi. Ulurin
bisa mengubah kepercayaan (follower) mereka jadi **pendapatan rutin yang transparan.**

**Contoh unggulan: Pandawara Group** (Bandung, berdiri 2022):
- **12 juta+ follower TikTok** (rekor Guinness), **1,3 juta+ kg sampah** diangkat, 221+ lokasi, **Forbes 30 Under 30 Asia 2025**, diundang Presiden Prabowo (Mar 2025). ([Forbes](https://www.forbes.com/profile/pandawara-group/))
- **Tapi pendanaannya sesekali, bukan rutin:** awalnya uang pribadi, lalu donasi untuk biaya operasional (sewa truk, kantong sampah, alat), lalu **sponsor CSR per-acara** (BRI, Citilink, Pertamina, dll: satu event lalu selesai). ([Waste4Change](https://waste4change.com/blog/pandawara-group-pemuda-inspiratif-penggiat-bebersih-sungai/))
- Crowdfunding mereka pun **lonjakan sesekali**: Des 2025 "patungan beli hutan" viral, janji selebritas ~Rp 1,5 miliar (Denny Sumargo, Denny Caknan, King Abdi), realisasi 2026. ([Tribun Jakarta](https://jakarta.tribunnews.com/news/427199/ajakan-pandawara-patungan-beli-hutan-bersambut-2-influencer-siap-beri-rp-15-miliar-netizen-ikutan))
- **Intinya (terbukti):** mereka bisa beli alat/truk/kantong untuk bersih-bersih **hanya saat ada sponsor**. Uangnya datang tidak teratur. **Bayangkan kalau rutin** lewat donasi transparan dari 12 juta follower-nya.

**Bukan cuma Pandawara, polanya berulang:**
- **Sungai Watch** (Bali/Jatim, ~3,7 juta kg sampah): model donasi "$1 = 1 kg", masih melobi Wapres untuk dukungan dana. ([Suara Surabaya](https://www.suarasurabaya.net/kelanakota/2025/37-juta-kilogram-sampah-diangkut-dari-sungai-sungai-watch-soroti-rendahnya-kesadaran-warga/))
- **Sedekah Rombongan** (15 tahun dampingi pasien dhuafa, 11 rumah singgah): 100% donasi per-kampanye, tiap program galang dana baru. ([sedekahrombongan.com](https://sedekahrombongan.com/))
- **Animal Defenders Indonesia** (rescue hewan): sampai **nombok biaya dokter dari kantong sendiri** karena pendapatan tidak teratur. ([Komunita.id](https://komunita.id/2016/02/01/animal-defenders-indonesia-berjuang-demi-hewan-hewan-telantar/))
- **Masjid + dapur umum / rumah makan gratis:** kerja sama dengan masjid untuk menjalankan dapur atau rumah makan gratis bagi yang membutuhkan. Dengan **donatur rutin**, "**dapur bisa ngebul terus**" (masak tiap hari), bukan cuma saat ada penyumbang besar sesekali. Kebutuhan harian = model donasi rutin = pas banget.
- **Relawan jalan rusak (nambal jalan):** mis. **Nanda (@relawan.jalan.rusak, Pekanbaru)** yang ~2 tahun menambal ~**79 lubang** pakai **uang sendiri + donasi follower** (klip viralnya 800rb+ views, Des 2025). Ia terang-terangan bilang harus tampil di medsos karena **itu satu-satunya cara dapat dukungan + perlindungan** ("sempat ada ancaman"). Ada juga **Suted (@suted.sukarno)**, **driver ojol** Demak yang menambal jalan sambil **live + terima donasi** penonton. Kontras: **Surya Insomnia** (komedian) menambal jalan **modal sendiri, sekali jalan, tanpa model donasi**, persis gap yang Ulurin isi. ([CatatanRiau](https://catatanriau.com/news/detail/28114/viral-relawan-jalan-rusak-di-pekanbaru-ditegur-rw-saat-tambal-jalan) · [Detik](https://www.detik.com/sumut/berita/d-8229844/cerita-surya-insomnia-ngaspal-jalan-berlubang-gue-iseng-sebenarnya)) *(catatan: jumlah follower belum terpublikasi, pakai angka 800rb+ views/79 lubang yang terverifikasi.)*

**Bagaimana Ulurin menolong:**
- Gerakan jadi **Kreator Kebaikan terverifikasi**; follower-nya bisa **berdonasi rutin (langganan)** untuk mendanai kerja mereka terus-menerus.
- **Bukti dua lapis (jujur):** on-chain membuktikan *alur uang* (terkumpul, potongan, bagian Kreator, yang dicairkan); untuk *dibelikan apa* (alat, truk, pohon, obat, pakan, bahan masak), Kreator upload **invoice/bukti** ke platform + donatur dapat **notifikasi update** di app. (Lihat "Dua lapis transparansi" di bagian 6.)
- Gerakan boleh ambil **imbalan transparan yang capped** sebagai penghasilan → "berbuat baik jadi pekerjaan utama" (persis visi), bukan lagi cost center yang menunggu sponsor.
- **Hasil:** kepercayaan (follower) berubah jadi **pendapatan bulanan yang stabil.** Dari hustle sesekali menjadi mata pencaharian berkelanjutan.

**Catatan jujur:** gerakan-gerakan di atas disebut sebagai **contoh/inspirasi
publik, BUKAN mitra atau pengguna Ulurin.** Angka jangkauan (follower, kg sampah)
adalah **klaim masing-masing gerakan** (dari sumber berita/laman resmi mereka),
bukan angka teraudit independen. Kolaborasi apa pun butuh **persetujuan gerakan**
+ prinsip transparansi & consent yang sama. Donasi rutin butuh scheduler off-chain
(fast-follow, lihat bagian 7).

## 3.4 Fase berikutnya: kurasi dana CSR (dana kebaikan terkurasi)

Perusahaan rutin mengeluarkan dana **CSR / TJSL** (Tanggung Jawab Sosial dan
Lingkungan, sebagian diwajibkan UU Perseroan Terbatas), tapi penyalurannya sering
**ad-hoc, sulit diukur dampaknya, dan berat pelaporannya.** Ulurin bisa jadi
**platform kurasi CSR:** perusahaan menaruh dana CSR, Ulurin mengkurasi ke
portofolio kasus/gerakan terverifikasi, condong ke yang **recurring** (dampak
berkelanjutan), dan tiap rupiah terbukti on-chain.

Analoginya seperti **reksadana / manajer investasi** (dana dikumpulkan lalu
dialokasikan ke portofolio pilihan), **tapi "return"-nya adalah dampak sosial
yang bisa diaudit**, bukan imbal hasil finansial.

- **Buat perusahaan:** CSR jadi mudah, terkurasi, dan terbukti, dengan laporan on-chain untuk audit + kredibilitas ESG/branding.
- **Buat gerakan/penerima:** pendanaan **rutin** dari CSR, bukan sponsor sekali-kali.
- **Buat Ulurin:** revenue B2B (fee kurasi/manajemen program), berskala besar.
- **Konteks pasar (bersumber):** potensi CSR Indonesia diperkirakan **~Rp 80-96 triliun/tahun** (Bappenas, 2025, [CNBC Indonesia](https://www.cnbcindonesia.com/news/20250804121649-4-654804/bappenas-potensi-filantropi-ri-capai-rp-6655-triliun-per-tahun)). Tapi yang benar-benar terkelola rapi jauh lebih kecil: **TJSL BUMN terealisasi ~Rp 11,2 triliun** (2023). Selisih potensi vs terkelola + keluhan lama bahwa dana CSR "belum dikelola maksimal" = **persis celah** yang platform kurasi ini isi.

**Catatan jujur:** butuh struktur legal + kepatuhan (aturan penggunaan dana CSR,
pelaporan TJSL), kemungkinan izin/registrasi sebagai lembaga penyalur, dan **jangan
pakai istilah "reksadana/manajer investasi" secara harfiah** (itu ranah OJK,
produk sekuritas berlisensi). Analogi itu hanya untuk menjelaskan model kurasi.
Ini FASE BERIKUTNYA yang jauh, bukan MVP.

## 4. Kamus istilah (halus, diterima berbagai kalangan)

| Hindari | Pakai |
|---|---|
| penggalang / advokat | **Kreator Kebaikan** |
| orang susah / yang minta | **Penerima Manfaat** |
| video minta-minta / jual kesedihan | **Cerita Kebaikan** |
| ambil jatah / potongan | **Imbalan Kreator** (transparan, capped 0-10%) |
| pemberi uang | **Donatur** (dapat badge *Donatur Terverifikasi*) |
| galang dana | **mengangkat dan menyalurkan kebaikan** |

**Cara jelasin ke orang (bahasa halus):**
- Analogi: "Kayak jurnalis atau pembuat dokumenter sosial yang dibayar untuk mengangkat cerita nyata dan memastikan bantuannya sampai. Bedanya: imbalannya transparan, berbatas 10%, dan tiap rupiah tercatat on-chain."
- Frasa positif: "memberi suara pada yang tak terdengar", "storytelling kebaikan", "membuktikan kebutuhan nyata biar terdanai".

## 5. Peran: Kreator Kebaikan

Orang yang menemukan kasus, memverifikasi, membuat Cerita Kebaikan, menyalurkan
bantuan, dan melaporkan hasilnya. Atas kerja itu ia berhak Imbalan Kreator yang
transparan dan berbatas.

**Akar legitimasi (framing jujur):** dalam zakat, amil (pengumpul dan penyalur)
berhak atas bagian sampai 12,5% (DSN-MUI). Dibayar untuk berbuat baik itu sah
berabad-abad. Yang Ulurin tambahkan: transparansi, batas, dan bukti on-chain.
Bukan mengklaim menciptakan konsepnya.

### Kredibilitas Kreator: KYC (Sumsub) + profil rekam jejak + rating

Kepercayaan tidak diklaim, tapi dibangun dan bisa dilihat.

- **KYC wajib via Sumsub.** Setiap orang yang mau jadi Kreator Kebaikan **wajib lolos verifikasi identitas lewat Sumsub** dulu sebelum bisa membuka campaign atau mencairkan dana. Sumsub dipilih karena penyedia KYC/AML yang **sudah teruji dan lazim di dunia crypto/fintech** (verifikasi dokumen + liveness + AML screening), jadi kredibel di mata partner Stellar/anchor, sekaligus mengunci "satu manusia terverifikasi per akun" (anti akun palsu + puppeteering).
- **Profil Kreator = rekam jejak terbuka.** Di profil tiap Kreator tampil **riwayat galang dana** (campaign apa saja yang pernah dibuka) lengkap dengan **total nominal terkumpul**, plus **riwayat bukti distribusi + invoice/nota** yang pernah di-upload. Calon donatur bisa menelusuri sendiri track record-nya.
- **Rating + komentar donatur (seperti seller marketplace).** Donatur bisa memberi **rating dan komentar** setelah berdonasi / melihat hasilnya. Skor + badge (mis. "Terverifikasi", "X kasus tuntas", "penyaluran tepat waktu") tampil di profil dan tiap campaign. Kreator baru mulai tier rendah (jangkauan/nominal dibatasi), naik seiring rekam jejak.
- **Efeknya:** sebelum berdonasi, orang bisa langsung menilai "Kreator ini kredibel nggak?", persis seperti cek rating + riwayat penjual sebelum belanja. Reputasi jadi aset yang dibangun, bukan diklaim. Memperkuat guardrail anti-penipuan.

Catatan: Sumsub = layanan pihak ketiga berbayar. Untuk MVP/testnet bisa pakai
mode sandbox Sumsub; KYC penuh menyala saat mendekati uang sungguhan (mainnet).

## 6. Workflow hulu ke hilir

**HULU, temukan dan verifikasi**
1. Kreator Kebaikan menemukan penerima nyata: perorangan (operasi, kecelakaan, obat, lansia terlantar, hewan sakit/terlantar) atau organisasi/yayasan (lihat bagian 3, mis. rumah yatim, shelter hewan, panti jompo, yayasan kanker/rehab, gerakan anti-kekerasan seksual).
2. Verifikasi: identitas Penerima Manfaat + bukti kebutuhan (nota/surat) + consent penerima.
3. Set target dana + Imbalan Kreator (slider 0-10%, default 0%, tampil jelas ke donatur).

**TENGAH, ceritakan dan galang**
4. Kreator membuat Cerita Kebaikan (video dan/atau foto yang bermartabat: siapa, kebutuhannya, rencananya) lalu masuk feed.
5. Feed di-ranking berdasarkan verifikasi + kejelasan goal + update hasil. BUKAN air mata atau kecepatan-donasi.
6. Donatur menonton, tersentuh, lalu one-tap donasi di layar yang sama (nominal, nama/@username/Anonim, komentar). Dana masuk escrow smart contract.

**HILIR, salurkan dan buktikan**
7. Dana ditahan escrow Soroban, dilepas per milestone/bukti (bukan instan cair; mematikan pola "ambil lagi").
8. Kreator salurkan bantuan, lalu upload bukti (foto/nota/video hasil).
9. Split otomatis on-chain: mayoritas ke Penerima, Imbalan Kreator (capped), fee platform kecil. Semua angka tampil.
10. Receipt publik: tiap donasi dan penyaluran tercatat, bisa dicek siapa pun tanpa login.
11. Donatur dapat notifikasi hasil, dan komentarnya berbadge Donatur Terverifikasi (tap untuk buka receipt on-chain).

### Dua lapis transparansi (jujur, JANGAN overclaim)

Penting supaya kita tidak menjanjikan yang tidak bisa dibuktikan on-chain:

- **Lapis 1, on-chain (alur uang):** total donasi terkumpul, potongan platform, bagian Kreator/yayasan, dan jumlah yang dicairkan/disalurkan. Ini yang benar-benar tercatat di ledger Stellar dan bisa dicek siapa pun tanpa login.
- **Lapis 2, off-chain (penggunaan dana):** untuk **dibelikan apa** (alat, truk, pohon, obat, pakan, dsb), Kreator meng-**upload invoice/nota/foto/video** ke platform, dan donatur dapat **notifikasi update** di app.

On-chain **TIDAK** otomatis membuktikan "uangnya dibelikan pohon/alat", itu butuh
invoice/bukti yang di-upload manual. Klaim jujurnya: **on-chain = alur uang;
invoice + update = bukti penggunaan.** Jangan gabungkan seolah on-chain melakukan keduanya.

## 7. Fitur kunci: one-tap donate di konten (video/foto) + badge terverifikasi

Konversi tanpa friksi: tersentuh langsung bisa bantu di layar yang sama (tidak
pindah ke web seperti Kitabisa). Di sinilah Stellar menonjol: settle sekitar 9,5
detik, fee sekitar 0,0007 dolar, jadi micro-donasi masuk akal.

**Alur:**
1. Lihat cerita (video/foto), tap layar, sheet donasi muncul di atasnya (kalau video, tetap jalan).
2. Nominal: preset (Rp 10rb / 25rb / 50rb / custom), satu tap konfirmasi (wallet sudah ada dari login Google, crypto-invisible).
3. Pilih identitas: nama / @username / Anonim.
4. Tulis komentar (opsional).

### Transparansi Imbalan Kreator (donatur wajib sadar SEBELUM memberi)

Setiap donatur HARUS melihat, sebelum konfirmasi, dalam bahasa awam: apa itu
Imbalan Kreator, berapa persen, dan untuk apa. Ini informed consent (opt-in
sebelum memberi), bukan potongan tersembunyi.

- **Di kartu campaign:** "Kreator [nama] menetapkan **X%** untuk biaya kerja: transport ke lokasi, verifikasi, produksi video, operasional, dan imbalan atas usahanya menyalurkan bantuan. **Sisanya (100-X%) untuk [penerima].**"
- **Di sheet one-tap, sebelum konfirmasi:** "Kamu memberi Rp 50.000: Rp [sisa] ke [penerima], Rp [imbalan] (X%) Imbalan Kreator, Rp [fee] fee platform." Tiap komponen bisa di-tap untuk penjelasan.
- **Kreator wajib menuliskan alasannya** (mis. "5% untuk transport 3 jam ke lokasi + verifikasi + bikin video"). Transparansi TUJUAN, bukan cuma angka.
- **Donatur sadar dan setuju:** ada acknowledgment yang terlihat; jika diaktifkan, donatur bisa **nol-kan** Imbalan Kreator.
- **Bahasa:** sebut "imbalan kerja / biaya operasional Kreator", BUKAN "potongan". Selalu diungkap dan capped 0-10%.

Kenapa penting: donatur memberi dengan mata terbuka. Itu yang membedakan Ulurin
dari "diam-diam ambil jatah" (kasus Cak Budi/ACT). Memperkuat guardrail #3.

**Badge donasi di komentar (twist kejujuran):** terbukti on-chain, bukan hiasan.
- Default aman: `Donatur Terverifikasi` (tanpa nominal).
- Opsional (donatur pilih): `Telah berdonasi Rp 50.000`.
- Anonim: `Anonim, Donatur`.
- Tiap badge bisa di-tap untuk buka receipt on-chain-nya ("cek sendiri").
- Kontrol tampil-nominal ada di tangan donatur (default badge tanpa angka) agar menjaga martabat, bukan ajang pamer.

**Social proof:** counter live "128 orang sudah bantu, +Rp 2,4jt hari ini" + feed donatur terbaru.

### Teknologi on/off-ramp: seamless untuk user, genuinely Stellar di belakang

User TIDAK berasa crypto: bayar/terima pakai rail familiar (QRIS, e-wallet, bank,
via agregator seperti Xendit/Midtrans), UI dalam rupiah. Tapi di belakang layar,
teknologinya benar-benar Stellar (bukan cuma "nampung koin"):

1. Fiat masuk → dikonversi jadi **USDC di Stellar** (aset settlement) lewat **anchor** (standar Stellar **SEP-24/SEP-6** untuk deposit/withdraw).
2. USDC masuk **escrow smart contract Soroban** yang menahan dana, meng-enforce cut 0-10%, dan melakukan split otomatis.
3. Tiap gerakan = **entry di public ledger Stellar** → itu receipt/bukti yang bisa diaudit siapa pun.
4. Penyaluran → penerima cash-out ke rupiah lewat anchor/off-ramp (mis. jaringan seperti yang dipakai Aid Assist).

**Kenapa Stellar "merasa teknologinya dipakai" (bukan cuma dompet USDC):**
- **Soroban smart contract** (escrow + cap + split) = logika berjalan DI Stellar, bukan di server kita.
- **Public ledger** = transparansi (nilai jual inti Stellar).
- **Anchor standards (SEP-24/SEP-31/SEP-38)** = pakai standar resmi Stellar untuk jembatan fiat.
- **Path payment** kalau lintas-aset (mis. rupiah → rupiah), dan pola **Stellar Disbursement Platform** cocok untuk penyaluran rutin/massal ke yayasan.

**Catatan jujur:** fiat cash-in/out ASLI butuh **anchor berlisensi (VASP)**. Indonesia
belum punya anchor Stellar yang live → ini bagian terberat. MVP/testnet: pakai
**sandbox anchor (demo SEP-24) + Xendit test mode → USDC testnet → escrow
Soroban**. Fiat sungguhan = butuh partner anchor berlisensi (roadmap, bukan MVP).

## 8. Fondasi kejujuran (guardrail wajib dari hari-1)

Format video donasi ini berisiko reputasi tinggi (preseden: "ngemis online"
mandi lumpur Indonesia 2023 yang di-takedown Kominfo; TikTok Syrian refugee
begging yang middleman-nya ambil ~70%; Kuaishou fake charity). "Bahasa halus" di
atas jujur HANYA kalau lima hal ini nyata:

1. **Ranking = etika.** Ranking by verifikasi + kejelasan goal + update hasil. BUKAN air mata / kecepatan-donasi / views. Reward cerita yang selesai (insentif "selesai lalu pergi", bukan terus tampil menderita). Tidak ada leaderboard "paling menderita".
2. **Escrow milestone + transparansi on-chain** (anti "ambil uang lagi"; tunjukkan ke mana tiap rupiah, hal yang Kitabisa/ACT tidak bisa).
3. **Fee transparan dan capped 0-10%**, donatur bisa nol-kan. Ini seluruh beda dari TikTok-70%-tersembunyi.
4. **Anak-anak dilindungi.** Tidak ada minor sebagai subjek on-camera atau beneficiary di feed. Garis mati, launch-blocker.
5. **Jalur non-video setara.** "Bisa galang tanpa mempertontonkan penderitaanmu." Video opt-in, bukan satu-satunya jalan ke atas feed.

Tambahan: verifikasi identitas + penggunaan dana; anti-middleman (payout hanya
ke wallet KYC penerima, bukan operator); launch recorded (bukan live) agar tiap
klip bisa direview sebelum di-boost.

## 9. Alignment dengan visi-misi Stellar (hasil riset stellar.org, 2026-07-11)

Diriset langsung: home, /foundation, /use-cases, /use-cases/stellar-for-aid,
/case-studies, /ecosystem.

**Misi SDF (kata mereka):** "creating equitable access to the global financial
system through blockchain technology." North Star: everyday financial services +
transparansi. Mereka mendukung "builders solving the financial access problem for
their communities."

**Stellar Aid Assist = kembaran Ulurin di hilir.** Program unggulan Stellar
untuk bantuan. Enam nilai yang mereka pasarkan sama persis dengan value-prop
Ulurin:

| Nilai Aid Assist | Ulurin |
|---|---|
| Instant | donasi one-tap, settle ~9,5 dtk |
| Transparent ("traceability of funds to ensure aid goes to those who need it") | receipt on-chain publik |
| Accessible (Aid Assist: "just need a mobile phone, no bank account") | crypto-invisible + login Google untuk **pakai app & donasi in-app** (tanpa ngerti crypto). Catatan jujur: **top up / tarik dana tetap perlu rail fiat** (bank/e-wallet/QRIS) |
| Stable (stablecoin) | USDC di bawah, rupiah di UI |
| Low cost (~1 sen / 10.000 tx) | micro-donasi masuk akal |
| Global cash-out (185 negara) | jalur cash-out (roadmap) |

Bedanya: **Aid Assist institusional** (lembaga upload daftar penerima, disburse
bulk, top-down, via Stellar Disbursement Platform). **Ulurin akar rumput**
(donor perorangan ke kasus perorangan, bottom-up).

**White space (temuan penting):**
- Case studies Stellar (19): semua institusi/regulated finance (Franklin Templeton, DTC, WisdomTree, UNHCR, IRC, MoneyGram, payroll). Nol app donasi konsumen.
- Ecosystem (521 proyek): didominasi tokenized assets, payments, DeFi, wallets. "Donasi/charity" bahkan bukan kategori submit-project.
- Artinya: Stellar punya bantuan INSTITUSIONAL (Aid Assist) tapi belum ada "Aid Assist untuk rakyat" yang peer-to-peer. Ulurin mengisi celah itu.

**Positioning terkuat:** "Stellar Aid Assist membuktikan bantuan transparan
on-chain di level lembaga. Ulurin membawa model yang sama ke akar rumput."

**Hook pitch (kata verbatim Stellar yang bisa digemakan):**
"get money into the hands of those who need it, quickly and at low cost" ·
"traceability of funds to ensure aid goes to those who need it" ·
"instant and transparent digital aid at scale" ·
"equitable access to the global financial system".

**Catatan jujur (aturan sama seperti proyek Stellar lain kami):**
- Posisikan Ulurin sebagai app inklusi finansial + bantuan transparan di ATAS rel Stellar, bukan mengklaim membangun infrastruktur.
- Bingkai lewat inklusi finansial + Aid Assist, bukan "monetisasi kreator" semata.
- JANGAN klaim afiliasi/pakai Aid Assist/SDP/UNHCR-IRC. Cukup "terinspirasi prinsip transparansi yang dibuktikan Stellar Aid Assist" (selaras model, bukan afiliasi).
- **JANGAN gemakan "no bank account" sebagai klaim Ulurin.** Aid Assist bisa karena penerima cash-out tunai via MoneyGram, tapi **on/off-ramp kita (top up / tarik) tetap butuh rail fiat** (bank/e-wallet/QRIS). Yang jujur: "pakai app + donasi in-app tanpa ngerti crypto; cash in/out lewat rail fiat biasa".

## 10. Roadmap produk (garis besar)

1. **MVP (testnet):** donasi kreator-cut + feed Cerita Kebaikan (video/foto) + one-tap donate + receipt publik on-chain + escrow/split Soroban.
2. **Fast-follow:** KYC penuh (Sumsub), rating + rekam jejak Kreator, donasi rutin (scheduler off-chain).
3. **Fase berikutnya:** rel zakat (bersama amil/LAZ terdaftar), kurasi dana CSR/TJSL.
4. **Butuh lisensi:** on/off-ramp fiat via anchor Stellar berlisensi (VASP) untuk uang sungguhan.

**Sumber riset Stellar:** stellar.org/foundation, stellar.org/use-cases/stellar-for-aid, stellar.org/case-studies, stellar.org/ecosystem (diakses 2026-07-11).
