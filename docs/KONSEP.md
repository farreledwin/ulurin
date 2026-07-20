# Ulurin: Konsep Bisnis dan Produk

🌐 **Bahasa:** Bahasa Indonesia (dokumen ini) · [English](KONSEP.en.md)

> Dokumen ini menjelaskan tesis bisnis Ulurin versi penyempurnaan. Statusnya masih definisi produk: belum ada klaim produksi, uang sungguhan, traction, atau kemitraan. Angka testnet/sandbox harus selalu dilabeli.

## 1. Ringkasan eksekutif

**Satu kalimat:** Ulurin membuat kerja menolong orang menjadi profesi yang jujur. Imbalan Kreator diumumkan sejak awal, dibatasi 0–5%, dan baru dapat dicairkan setelah bukti yang diwajibkan terpenuhi.

**Masalah yang diselesaikan:** Indonesia sangat dermawan, tetapi rel donasinya tidak memberi donatur visibilitas yang cukup dan tidak memberi penggalang bantuan cara yang jujur untuk dibayar. Akibatnya, kepercayaan rusak, bantuan berpindah ke kanal personal yang tidak terstruktur, dan setiap rupiah yang diambil penggalang mudah dianggap sebagai penyelewengan.

**Solusi:** satu platform dengan dua pintu discovery, yaitu feed Cerita Kebaikan dan marketplace campaign. Keduanya memperlihatkan pembagian dana sebelum pembayaran, memisahkan bagian penerima dari Imbalan Kreator, mengunci aturan itu di smart contract, lalu membangun reputasi kreator dari campaign yang benar-benar diselesaikan.

**Model bisnis:** platform fee Ulurin **3%**, ditampilkan sebagai baris tersendiri dan dipotong dari donasi, bukan ditambahkan di atasnya (diputuskan 16 Juli 2026 — lihat DECISIONS.md). Imbalan Kreator **0–5%** sesuai tier verifikasi adalah kompensasi orang yang melakukan kerja lapangan, bukan pendapatan platform. Campaign termahal yang mungkin adalah 8%, dua poin di bawah batas 10% PP No. 29/1980.

**Tesis besarnya:** kejujuran dan penghasilan tidak saling bertentangan. Justru ketika pekerjaan penggalang diberi harga secara terbuka, donatur dapat membedakan biaya kerja yang sah dari penyalahgunaan.

## 2. Masalah: bukan kekurangan niat baik, tetapi rel yang salah

### 2.1 ACT menunjukkan kegagalan struktur

Boeing menyerahkan **Rp138.546.388.500** kepada ACT untuk fasilitas sosial dan pendidikan bagi komunitas terdampak Lion Air JT610. Hanya **Rp20.563.857.503** yang dipakai sesuai program; hanya 6 dari 70 rencana yang terwujud. Sebanyak **Rp117.982.530.997** digunakan di luar peruntukannya. ([Kompas](https://nasional.kompas.com/read/2022/11/15/14161711/dakwaan-bos-act-pencairan-dana-sosial-boeing-hanya-lewat-whatsapp) · [Vice](https://www.vice.com/en/article/boeing-embezzlement-lion-air-indonesia/))

Yang gagal bukan hanya moral individu. Organisasi yang sama memegang uang, menentukan alokasi, menjalankan entitas terafiliasi, dan menguasai laporan yang dilihat korban. Ketika custody dan bukti berada di tangan pihak yang berkepentingan, uang dapat terserap ke dalam gedungnya sendiri sambil tetap tampak sebagai aktivitas bantuan.

### 2.2 Cak Budi menunjukkan pekerjaan yang tidak punya harga jujur

Cak Budi mengumpulkan sekitar **Rp1,2 miliar** lalu membeli Fortuner dan iPhone. Alat itu mungkin saja berguna untuk operasional. Namun donatur tidak pernah menyetujui persentase yang menjadi haknya dan tidak ada rel yang membatasi pengambilannya. ([Detik](https://news.detik.com/berita/d-3488851/heboh-pengakuan-cak-budi-pakai-uang-donasi-untuk-beli-fortuner))

Ulurin tidak dibangun dari anggapan bahwa orang baik harus bekerja gratis. Ulurin dibangun dari anggapan bahwa bayaran harus **terbuka, berbatas, beralasan, dan terkait penyelesaian pekerjaan**.

### 2.3 Hukum sudah ada

- [UU No. 9 Tahun 1961](https://peraturan.bpk.go.id/Details/51166/uu-no-9-tahun-1961) mengatur izin pengumpulan uang atau barang.
- [PP No. 29 Tahun 1980 Pasal 6 ayat (1)](https://peraturan.bpk.go.id/Download/56955/PP%20NO%2029%20TH%201980.pdf) membatasi biaya pengumpulan sumbangan maksimal 10%.

Ulurin bukan pembuat aturan baru. Nilai tambahnya adalah mengubah batas yang biasanya baru diperiksa melalui audit menjadi kondisi transaksi yang dapat gagal sebelum dana bergerak.

Smart contract tidak menggantikan izin, pengawasan, atau proses hukum. Ia hanya membuat aturan keuangan tertentu lebih sulit dilanggar secara diam-diam.

## 3. Kenapa ini peluang bisnis

### 3.1 Keinginan memberi tetap hidup, kepercayaan berpindah

Survei Median terhadap 1.500 responden setelah kasus ACT menemukan **44,7% tidak percaya lagi kepada lembaga sejenis**, sementara **30,1% masih percaya**. ([Detik](https://news.detik.com/berita/d-6210306/survei-median-pakai-gform-44-7-responden-tak-percaya-lembaga-serupa-act)) BAZNAS melaporkan perolehan kurban sekitar **47% target** ketika pada tahap yang sama biasanya sekitar 80%. Deputinya menyimpulkan bahwa keinginan berbuat baik bertahan, tetapi bergerak ke jalur personal. ([JPNN](https://www.jpnn.com/news/buntut-kasus-act-baznas-prediksi-jumlah-donasi-masyarakat-berkurang))

Itulah titik masuk Ulurin: bukan menciptakan kemurahan hati baru, melainkan memberi struktur, insentif, dan bukti pada donasi yang sudah bergerak lewat individu.

### 3.2 Ukuran ruang ekonomi

| Indikator | Nilai | Makna yang aman |
|---|---:|---|
| ZIS formal nasional | **Rp40,5 triliun** pada 2024 | Arus formal sudah besar dan tumbuh. [BAZNAS](https://baznas.go.id/assets/images/szn/LPZ%20Nasional%20Akhir%20Tahun%202024.pdf) |
| Potensi zakat nasional | **Rp327,6 triliun/tahun** | Estimasi potensi, bukan pendapatan yang otomatis dapat direbut Ulurin. [Kemenag](https://kemenag.go.id/nasional/potensi-mencapai-327-t-ini-tiga-fokus-kemenag-dalam-pengembangan-zakat-LobJF) |
| Potensi filantropi Indonesia | **Rp650–665 triliun/tahun** | Estimasi Bappenas untuk konteks makro, bukan TAM tervalidasi. [CNBC Indonesia](https://www.cnbcindonesia.com/news/20250804121649-4-654804/bappenas-potensi-filantropi-ri-capai-rp-6655-triliun-per-tahun) |
| Kitabisa | **Rp830 miliar disalurkan, 8 juta donatur** | Bukti bahwa donasi digital memiliki permintaan nyata. [Kitabisa](https://kitabisa.com/about-us) |
| Indonesia | **Negara paling dermawan tujuh tahun berturut-turut** | Masalahnya bukan willingness to give. [CAF](https://www.cafonline.org/home/about-us/press-office/indonesia-retains-top-place-in-world-giving-index-with-ukraine-climbing-to-second-most-generous-country) |

Angka potensi tidak boleh dipresentasikan sebagai pendapatan Ulurin. Pasar awal yang lebih jujur adalah campaign individu dan komunitas yang sudah memiliki bukti aktivitas, audiens, serta kebutuhan pendanaan berulang.

### 3.3 Kerja penggalang belum dihargai secara sehat

Penggalang lapangan menjalankan pekerjaan bernilai ekonomi: penemuan kasus, verifikasi, consent, perjalanan, koordinasi vendor, distribusi, dokumentasi, komunikasi, dan pelaporan. Sistem yang hanya membayar platform tetapi menganggap penggalang harus gratis menciptakan dua hasil buruk:

1. kreator yang baik berhenti karena kelelahan atau bergantung pada sponsor;
2. kreator yang tetap mengambil biaya terdorong menyembunyikannya di dalam pengeluaran campaign.

Ulurin mengubah penghasilan tersembunyi menjadi Imbalan Kreator yang dapat dilihat dan dinilai donatur.

## 4. Kategori yang dibangun: philanthropreneur

**Philanthropreneur** adalah kategori bisnis dan gerakan: orang dapat membangun penghidupan dengan menyelesaikan pekerjaan sosial secara berulang dan dapat dipertanggungjawabkan.

Masa depan yang dibangun Ulurin lebih besar daripada marketplace donasi. Ulurin sedang membangun **pasar kerja untuk kebaikan**. Hari ini, penolong yang cakap bekerja setelah jam kerja, memakai uang pribadi, atau bergantung pada sponsor sementara. Di masa depan, menolong dapat menjadi pekerjaannya sendiri, dengan penghasilan yang diperoleh dari rekam jejak pelayanan yang transparan dan terbukti.

Perubahannya harus terasa dalam kehidupan sehari-hari:

- ribuan gerakan lokal terpercaya, bukan hanya satu Pandawara yang luar biasa;
- jalan diperbaiki melalui campaign bulanan yang terencana, bukan hanya setelah satu video viral;
- panti asuhan, panti jompo, shelter, dan dapur gratis dapat merencanakan bulan berikutnya;
- kreator dapat bertahan karena kompensasi jujur mencegah burnout;
- donatur kembali memberi karena setiap siklus yang selesai menghasilkan bukti.

**Efek domino:** imbalan jujur membuat penolong bertahan. Penolong yang bertahan menyelesaikan lebih banyak hasil. Hasil yang selesai menghasilkan bukti. Bukti menumbuhkan kepercayaan. Kepercayaan melahirkan donasi berulang. Donasi berulang mendanai lebih banyak orang untuk menolong secara profesional.

`Imbalan jujur -> penolong bertahan -> hasil selesai -> bukti terlihat -> kepercayaan tumbuh -> donasi berulang -> lebih banyak penolong profesional`

Penghasilan Kreator harus tumbuh karena pekerjaan yang selesai dan kepercayaan donatur bertumbuh. Penghasilan itu tidak boleh tumbuh karena produk memberi insentif pada penderitaan yang semakin dramatis.

**Kreator Kebaikan** adalah peran di dalam produk. Ia bukan sekadar pembuat konten, melainkan orang atau tim yang:

1. menemukan kebutuhan;
2. memverifikasi identitas, kebutuhan, dan consent;
3. menyampaikan cerita dengan bermartabat;
4. mengatur pengumpulan dan penyaluran;
5. mengunggah bukti serta menanggapi donatur.

Konten adalah alat discovery. Hasil bantuan adalah produknya.

## 5. Pengguna nyata

### Gerakan yang dipimpin Kreator Kebaikan

- **[Pandawara Group](https://www.tiktok.com/@pandawaragroup):** gerakan lima orang dari Bandung yang mempublikasikan pembersihan sungai dan pantai. Guinness mencatat 12.137.832 follower TikTok pada Maret 2026; Forbes melaporkan lebih dari 1,3 juta kilogram sampah diangkat dan memasukkan mereka ke 30 Under 30 Asia 2025. Use case Ulurin adalah pendanaan rutin untuk truk, bahan bakar, peralatan, pengelolaan sampah, dan tenaga lapangan, dengan alokasi proyek terpisah dari Imbalan Kreator. ([Guinness](https://www.guinnessworldrecords.com/world-records/782570-most-followers-on-tiktok-for-an-environmental-clean-up-group) · [Forbes](https://www.forbes.com/profile/pandawara-group/))
- **[Nanda / @relawan.jalan.rusak](https://www.tiktok.com/@relawan.jalan.rusak):** diberitakan menambal sekitar 79 lubang jalan di Riau selama dua tahun dengan uang pribadi dan dukungan follower. Ulurin mengubah setiap ruas menjadi campaign yang memiliki scope, anggaran material, serta bukti sebelum/sesudah. ([Catatan Riau](https://catatanriau.com/news/detail/28114/viral-relawan-jalan-rusak-di-pekanbaru-ditegur-rw-saat-tambal-jalan))
- **[Suted / @suted.sukarno](https://www.tiktok.com/@suted.sukarno):** driver ojek online yang mengoordinasikan perbaikan jalan pada malam hari bersama komunitasnya di Demak dan menerima donasi penonton. Ulurin membuat dukungan tersedia di luar livestream viral dan memberi donatur riwayat penyelesaian yang permanen. ([Jateng News](https://www.jatengnews.id/2026/02/25/ojol-demak-tambal-jalan-berlubang-dini-hari-tuai-simpati-warganet/))

### Lembaga dan program rutin

Panti asuhan, panti jompo, dapur makan gratis, shelter hewan, rumah singgah pasien, pusat rehabilitasi, lembaga bantuan hukum, dan kelompok riset independen mempunyai biaya yang kembali setiap bulan. Campaign Ulurin mereka harus berjalan per siklus: otorisasi donatur rutin, alokasi bulanan ke penerima, bukti spesifik untuk bulan tersebut, dan Imbalan Kreator yang baru dilepas setelah kewajiban bukti siklus itu terpenuhi.

Use case-nya bukan “galang sekali lalu hilang”, melainkan “biayai layanan bulan depan, tunjukkan hasil bulan ini, lalu biarkan kepercayaan bertumbuh”.

### Penerima Manfaat

- individu atau keluarga dalam kondisi kesehatan, kecelakaan, kehilangan nafkah, atau ketidakadilan;
- organisasi seperti shelter, panti, yayasan kesehatan, lembaga bantuan hukum, dan lembaga riset independen;
- komunitas terdampak banjir, gempa, erupsi, dan bencana lain.

### Donatur

Donatur mobile-first yang berpikir dalam rupiah. Mereka menginginkan alur pembayaran familiar, pembagian dana yang jelas, rekam jejak kreator, dan bukti setelah bantuan disalurkan.

Skenario kreator, layanan rutin, kasus sekali jalan, dan keadaan darurat dijelaskan lengkap dalam [Use Case Konkret](USE-CASES.md).

## 6. Produk: dua discovery, satu sumber kebenaran

### Feed Cerita Kebaikan

Feed vertikal video/foto membuat discovery cepat dan memungkinkan one-tap donate tanpa berpindah ke formulir lain. Video tidak wajib; campaign foto dan teks harus memiliki peluang fungsional yang setara.

Ranking mengutamakan kualitas verifikasi, kejelasan target, relevansi, riwayat penyelesaian, dan update hasil. Ranking tidak boleh mengoptimalkan air mata, eksploitasi anak, atau kecepatan donasi semata.

### Marketplace campaign

Marketplace mendukung pencarian dan perbandingan berdasarkan kategori, lokasi, urgensi, tier kreator, progres, kebutuhan rutin, dan status campaign.

Feed dan marketplace membaca campaign, fee, progres, proof state, dan reputasi yang sama. Tidak boleh ada angka berbeda antarpermukaan.

### Checkout transparan

Sebelum pembayaran, donatur melihat:

| Komponen | Arti |
|---|---|
| Bagian Penerima | Dana untuk kebutuhan yang dijelaskan. |
| Imbalan Kreator | 0–5%, sesuai tier dan alasan kerja. |
| Platform fee | 3%, ditampilkan terpisah. |
| Total pembayaran | Jumlah persis yang disetujui donatur. |

Kreator wajib menjelaskan penggunaan imbalannya dengan bahasa biasa: transport, verifikasi, produksi dokumentasi, koordinasi, operasional, dan kompensasi tenaga. Bahasa yang halus tidak boleh menjadi cara menyembunyikan bahwa sebagian dana adalah penghasilan pribadi.

### Urutan pencairan

Prinsip versi ini adalah **penerima lebih dahulu, kreator terakhir**:

1. bagian penerima tidak ditahan karena kreator belum menyelesaikan dokumentasi;
2. Imbalan Kreator tetap terkunci;
3. kreator mengunggah bukti yang disyaratkan;
4. penerima dan/atau reviewer mengonfirmasi;
5. Imbalan Kreator baru dapat dilepas.

Aturan pencairan platform fee, milestone, pembatalan, dan refund masih harus diputuskan sebelum kontrak dibuat.

## 7. Reputasi sebagai aset bisnis

Profil Kreator menampilkan:

- tier KYC dan batas imbalan;
- campaign aktif, selesai, batal, serta sengketa;
- total terkumpul dan tersalurkan;
- riwayat invoice, dokumentasi, dan konfirmasi penerima;
- completion rate serta rata-rata waktu ke proof;
- rating dari donatur yang benar-benar bertransaksi;
- riwayat Imbalan Kreator.

Hanya donatur dengan transaksi terkonfirmasi yang dapat memberi satu rating per campaign setelah outcome/proof tersedia. Rating perlu memisahkan hasil, komunikasi, dan kualitas bukti; satu angka bintang tanpa konteks mudah dimanipulasi.

Berita berjalan hanya menampilkan event terkonfirmasi dan menghormati pilihan nama, nominal, atau anonim. Penyaluran dan campaign selesai juga ditampilkan agar social proof tidak hanya merayakan uang masuk.

## 8. Model bisnis

### Sumber pendapatan awal

**Platform fee 3%** mendanai payment operations, KYC, review campaign, moderasi konten, review bukti, sengketa, keamanan, infrastruktur, dukungan pelanggan, dan kepatuhan.

Belum diputuskan apakah 5% ditambahkan di atas nominal yang dimasukkan donatur atau dipotong dari total tersebut. Keputusan ini memengaruhi bagian penerima, UX, kontrak, pembukuan, serta perlakuan legal.

### Imbalan Kreator bukan revenue Ulurin

Imbalan 0–5% dibayarkan kepada Kreator Kebaikan. Tier 0 tidak boleh mengambil imbalan. Tier lebih tinggi membuka batas 3% dan 5% berdasarkan verifikasi serta rekam jejak.

### Ekspansi pendapatan

- layanan campaign berulang untuk organisasi;
- program kurasi dan pelaporan CSR/TJSL untuk perusahaan;
- infrastruktur transparansi untuk amil/LAZ berizin pada fase zakat;
- layanan distribusi lintas negara untuk diaspora setelah jalur fiat dan FX berlisensi tersedia.

CSR dan zakat adalah fase lanjutan, bukan cara untuk membesarkan TAM MVP secara artifisial.

### Unit economics belum terbukti

Fee 5% harus diuji terhadap biaya payment gateway, payout, KYC, review manual, fraud loss, chargeback, refund, dukungan, pajak, dan mitra berlisensi, terutama untuk donasi Rp10.000–Rp50.000. Volume besar tidak otomatis berarti margin sehat.

## 9. Go-to-market

### Wedge awal: kreator dengan bukti kerja, bukan selebritas semata

Kreator awal ideal memiliki:

- aktivitas bantuan yang sudah dapat dilihat;
- komunitas atau follower yang mengenali pekerjaannya;
- kebutuhan pendanaan berulang;
- kemauan menjalani verifikasi dan pelaporan;
- satu campaign dengan outcome yang mudah didefinisikan.

Ulurin dapat memperoleh supply lewat komunitas lingkungan, dapur komunitas, relawan jalan, rescue hewan, serta organisasi lokal. Akuisisi donor pertama datang dari audiens kreator, bukan iklan massal platform.

### Loop pertumbuhan

1. kreator membawa komunitasnya;
2. donor melihat pembagian dan berdonasi;
3. outcome, proof, dan receipt dikirim kembali;
4. reputasi kreator meningkat;
5. campaign berikutnya memiliki konversi dan repeat donor lebih baik;
6. profil publik menjadi portofolio dampak yang dapat dibawa kreator.

Moat yang dicari bukan sekadar smart contract yang dapat disalin, melainkan jaringan kreator terverifikasi, data penyelesaian campaign, operasi review, hubungan berlisensi, serta kepercayaan donor yang terakumulasi.

## 10. Posisi terhadap alternatif

| Alternatif | Kuatnya | Celah yang diambil Ulurin |
|---|---|---|
| Kitabisa/marketplace donasi | Distribusi, brand, dan pengalaman campaign | Kerja penggalang tidak menjadi penghasilan transparan yang proof-gated; cerita biasanya membawa pengguna ke flow terpisah. |
| TikTok/Instagram + transfer pribadi | Discovery dan kedekatan dengan kreator | Pembagian, custody, proof, rating, dan histori campaign terpencar. |
| Saweria/Trakteer | Pembayaran langsung kepada kreator | Tidak dirancang untuk beneficiary, consent, distribusi bantuan, atau bukti outcome. |
| Lembaga amal tradisional | Operasi dan jaringan penerima | Donatur harus banyak mempercayai laporan institusi dan penggalang individu tidak membangun reputasi portabel. |

Ulurin tidak menang hanya karena “memakai blockchain”. Ia harus menang karena membuat alur consent–split–release–proof–reputation lebih jelas daripada alternatif.

## 11. Stellar dan Xendit

### Fungsi Stellar

- Soroban menegakkan tier cap dan pemisahan alokasi;
- ledger menjadi sumber bukti untuk transaksi yang benar-benar terjadi di Stellar;
- biaya rendah mendukung micro-donation;
- public receipt menghubungkan status manusia dengan transaction evidence.

### Fungsi Xendit Sandbox

Xendit Sandbox menguji UX payment dan payout rupiah. Ia bukan Stellar anchor, bukan VASP, dan tidak otomatis menukar rupiah menjadi USDC.

Produksi memerlukan pihak berlisensi untuk custody dan konversi bila aset crypto digunakan, serta source of truth dan rekonsiliasi antara payment provider, database aplikasi, dan Stellar.

### Batas pembuktian

On-chain membuktikan perpindahan aset, aturan split, dan waktu release. On-chain tidak membuktikan identitas, kebutuhan, keaslian invoice, barang diterima, atau dampak. Kebenaran off-chain memerlukan KYC, consent, review, beneficiary acknowledgement, dan sengketa.

## 12. Guardrail martabat dan kejujuran

- Tidak ada donor, nominal, testimonial, partner, atau traction fiktif.
- Imbalan Kreator dan platform fee selalu terlihat sebelum pembayaran.
- Penerima memiliki consent atas cerita dan media.
- Konten anak dan kelompok rentan memerlukan kebijakan perlindungan yang ketat; eksploitasi tidak boleh menjadi mesin ranking.
- Jalur non-video setara dengan video.
- Bukti yang gagal review tidak boleh membuka Imbalan Kreator.
- Produk tidak mengatakan blockchain membuktikan sesuatu yang tidak pernah diamati blockchain.
- Contoh gerakan publik selalu diberi label inspirasi, bukan partner.

## 13. Tahapan bisnis

1. **Definisi dan validasi:** selesaikan formula fee, status campaign, proof policy, refund, custody, privacy, dan legal review.
2. **Prototype sandbox/testnet:** feed + marketplace, checkout transparan, profil kreator, receipt, Xendit Sandbox, dan kontrak testnet yang sesuai state machine final.
3. **Pilot terbatas:** beberapa kreator dan campaign terkurasi, transaksi sandbox atau struktur legal yang disetujui, review bukti manual.
4. **Uang sungguhan:** hanya setelah izin, mitra settlement, custody, rekonsiliasi, fraud operations, dan consumer protection siap.
5. **Ekspansi:** recurring giving, diaspora, zakat bersama amil/LAZ, serta CSR/TJSL terkurasi.

## 14. Ukuran keberhasilan

- conversion setelah pembagian fee ditampilkan;
- pemahaman donatur mengenai siapa menerima apa;
- repeat donation dan repeat campaign;
- tingkat serta waktu penyelesaian proof;
- beneficiary acknowledgement;
- dispute, cancellation, refund, dan fraud rate;
- persentase kreator yang menyelesaikan lalu kembali membuat campaign;
- contribution margin setelah seluruh biaya operasional.

Total dana terkumpul tanpa proof completion yang tinggi bukan validasi tesis Ulurin.

## 15. Keputusan yang masih terbuka

Sebelum pembangunan aplikasi, tim masih harus menyepakati:

- ~~platform fee ditambah atau dipotong~~ — diputuskan 16 Juli 2026: dipotong dari donasi, tidak pernah ditambahkan di atasnya (lihat DECISIONS.md #1);
- interaksi seluruh fee dengan batas biaya 10% PP 29/1980;
- waktu pencairan platform fee;
- bukti minimal, reviewer, dispute, dan appeal;
- refund setelah bagian penerima lebih dahulu dicairkan;
- model all-or-nothing, keep-what-you-raise, atau milestone;
- definisi KYC tier dan batas nominal;
- pihak yang secara legal boleh menggalang dan memegang dana;
- custody wallet, signing, recovery, serta admin powers;
- partner IDR–aset Stellar dan proses rekonsiliasi;
- kebijakan anak, medis, lokasi, retensi media, dan penghapusan consent;
- ketahanan rating terhadap manipulasi;
- kelayakan unit economics platform fee 3%.
- state machine campaign rutin: scheduler, retry, pause, bukti per siklus, dan penghentian layanan.

Daftar lengkapnya berada di [Decisions and Open Questions](DECISIONS.md).
