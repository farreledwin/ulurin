# Ulurin

🌐 **Bahasa:** [English](README.md) · Bahasa Indonesia (halaman ini)

**Menolong sesama, dijadikan profesi yang jujur.**

Indonesia tidak kekurangan orang dermawan. Yang rusak adalah lapisan kepercayaannya, ditambah kerja nyata penggalang bantuan yang selama ini tidak dihargai secara terbuka.

Ulurin adalah platform donasi tempat orang yang bekerja di lapangan boleh dibayar secara jujur, donatur melihat seluruh pembagian dana sebelum membayar, dan aturan fee ditegakkan oleh rel uangnya, bukan sekadar dijanjikan dalam laporan.

> **Status saat ini (16 Juli 2026):** aturan fee yang diargumentasikan dokumen
> ini bukan lagi usulan — ia ditegakkan oleh smart contract yang sudah
> ter-deploy.
>
> **Yang nyata hari ini, bisa diperiksa publik:**
> - **Vault:** [`CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3`](https://stellar.expert/explorer/testnet/contract/CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3)
>   di Stellar Testnet, settle dalam **USDC** testnet Circle. Setiap donasi
>   terbagi saat tiba (penerima / kreator / platform), campaign yang total
>   pembiayaannya melewati **10%** — PP No. 29/1980 Pasal 6(1) — ditolak
>   sebelum dibuat, dan imbalan kreator terkunci sampai hash bukti tercatat.
>   Jejak transaksi lengkap ada di [DEPLOYMENTS.md](DEPLOYMENTS.md).
> - **Aplikasinya:** [ulurin-test.vercel.app](https://ulurin-test.vercel.app) —
>   alur donasi bisa menyelesaikan donasi testnet sungguhan lewat vault dan
>   memberi struk yang hash-nya bisa dibuka siapa pun di explorer.
> - **Skema fee yang ditegakkan kontrak:** 2% platform + imbalan kreator
>   dibatasi tier verifikasi 0% / 3% / 5%, sehingga campaign termahal yang
>   mungkin adalah 7% — sengaja tiga poin di bawah batas hukum. Lihat
>   [`/tier`](https://ulurin-test.vercel.app/tier) untuk alasan tiap anak
>   tangga berhenti di tempatnya.
> - **Build Android:** aplikasi yang sama, terverifikasi membaca state vault
>   live dari dalam WebView ([apps/ulurin/android-qa.md](apps/ulurin/android-qa.md)).
>
> **Masih simulasi:** pembayaran rupiah (Xendit di sini simulator sandbox,
> bukan anchor), rating, review bukti, dan feed aktivitas. USDC testnet bukan
> uang sungguhan. Ini bukan aplikasi produksi, kemitraan, atau layanan fiat
> berlisensi — batas antara dua daftar di atas dinyatakan di aplikasinya
> sendiri, di setiap layar yang relevan.

## Lukanya bersifat struktural

### ACT: uangnya nyaris tidak keluar dari institusinya

Boeing mempercayakan **Rp138.546.388.500** kepada ACT untuk fasilitas sosial dan pendidikan bagi komunitas yang terdampak meninggalnya 189 orang dalam penerbangan Lion Air JT610. Hanya **Rp20.563.857.503** yang dipakai untuk program yang disepakati, dan hanya 6 dari 70 fasilitas yang direncanakan terwujud. Sebanyak **Rp117.982.530.997** dialihkan, termasuk ke gaji dan bonus internal, entitas terafiliasi, koperasi, serta pembayaran langsung kepada pendiri. ([Kompas](https://nasional.kompas.com/read/2022/11/15/14161711/dakwaan-bos-act-pencairan-dana-sosial-boeing-hanya-lewat-whatsapp) · [Vice](https://www.vice.com/en/article/boeing-embezzlement-lion-air-indonesia/))

Ini bukan sekadar seseorang mengambil uang dari kotak donasi. Institusi yang sama menguasai penyimpanan dana, alokasi, pelaporan, dan bukti yang dilihat keluarga korban. Dana dapat berputar di jaringan internal sambil tetap tampak sebagai operasi bantuan yang sah. Keluarga baru mengetahui kenyataannya bertahun-tahun kemudian karena tidak ada rel publik yang memisahkan uang penerima dari kepentingan lembaga.

### Cak Budi: mobil operasional tidak menyelesaikan potongan yang tidak disepakati

Sebelum menjadi skandal, Cak Budi adalah penggalang bantuan akar rumput yang dipercaya banyak orang. Fortuner dan iPhone miliknya mungkin saja membantu perjalanan, dokumentasi, dan koordinasi. Namun itu bukan lagi pertanyaan terpenting. ([Detik](https://news.detik.com/berita/d-3488851/heboh-pengakuan-cak-budi-pakai-uang-donasi-untuk-beli-fortuner))

Masalahnya adalah donatur tidak pernah diminta menyetujui bagian yang jelas untuk pekerjaannya. Tidak ada aturan yang dapat ia tunjukkan: *sekian persen untuk penerima, sekian persen untuk transport dan tenaga saya, dan saya tidak dapat mengambil lebih*. Biaya yang mungkin sah menjadi tidak bisa dibedakan dari penyalahgunaan karena sistemnya tidak menyediakan cara jujur untuk menghargai kerja penggalang.

## Hukumnya sudah ada. Penegakannya yang hilang.

- [**UU No. 9 Tahun 1961**](https://peraturan.bpk.go.id/Details/51166/uu-no-9-tahun-1961) mengatur izin dan pengawasan pengumpulan uang atau barang dari masyarakat.
- [**PP No. 29 Tahun 1980 Pasal 6 ayat (1)**](https://peraturan.bpk.go.id/Download/56955/PP%20NO%2029%20TH%201980.pdf) membatasi biaya pengumpulan sumbangan paling tinggi 10%.

Ulurin tidak menawarkan peraturan baru. Ulurin menawarkan rel tempat imbalan yang melampaui batas legal dan batas tier verifikasi ditolak sebelum transaksi terjadi.

Audit menemukan pelanggaran setelah kerusakan terjadi. Aturan transaksi mencegah pelanggaran ketika seseorang mencoba melakukannya.

## Ini masalah bisnis, bukan hanya masalah moral

| Pihak | Yang rusak hari ini |
|---|---|
| Donatur | Melihat cerita dan angka terkumpul, tetapi jarang melihat pembagian yang dapat ditegakkan atau receipt publik. |
| Penerima Manfaat | Bergantung pada perantara yang dapat mencampur uang operasional dengan dana bantuan. |
| Kreator Kebaikan | Menemukan kasus, memverifikasi, bepergian, mengatur penyaluran, membuat dokumentasi, dan melapor, sering tanpa bayaran yang diungkap. |
| Platform | Mendapat fee, sementara kerusakan kepercayaan mendorong donasi keluar dari lembaga formal menuju kanal personal yang terpencar. |

Setelah kasus ACT, survei Median terhadap 1.500 orang menemukan **44,7% tidak lagi percaya kepada lembaga serupa ACT**, sedangkan yang masih percaya hanya **30,1%**. ([Detik](https://news.detik.com/berita/d-6210306/survei-median-pakai-gform-44-7-responden-tak-percaya-lembaga-serupa-act)) BAZNAS juga melihat perolehan kurban berada di sekitar **47% target** ketika biasanya sudah sekitar 80%. Deputinya menyatakan keinginan memberi tidak hilang; donatur berpindah ke jalur perorangan. ([JPNN](https://www.jpnn.com/news/buntut-kasus-act-baznas-prediksi-jumlah-donasi-masyarakat-berkurang))

Peluang Ulurin bukan membujuk orang Indonesia agar menjadi dermawan. Mereka sudah dermawan. Peluangnya adalah membuat bantuan yang dipimpin individu cukup transparan dan berkelanjutan untuk layak dipercaya.

## Masa depan yang ingin dibangun Ulurin

**Berbuat baik sebagai pekerjaan utama.**

Hari ini, menolong orang biasanya dilakukan setelah jam kerja, memakai tabungan sendiri, atau menunggu sponsor berikutnya. Orang yang paling baik mengerjakannya kehabisan tenaga. Gerakan dengan jutaan follower pun dapat berhenti ketika satu sponsor pergi.

Ulurin tidak sekadar ingin membuat lebih banyak halaman campaign. Ulurin sedang membangun **pasar kerja untuk kebaikan**, tempat seseorang dapat memperoleh penghidupan dengan berulang kali menyelesaikan bantuan yang dapat diperiksa donatur.

> Bukan hanya satu Pandawara, tetapi ribuan gerakan lokal terpercaya.
>
> Bukan jalan yang diperbaiki hanya ketika video viral, tetapi perbaikan yang dapat berjalan setiap bulan.
>
> Bukan dapur gratis yang menunggu satu donatur besar, tetapi dapur yang dapat merencanakan makan besok sejak hari ini.
>
> Bukan relawan yang berhenti setelah melakukan semuanya dengan benar, tetapi profesional yang penghasilannya tumbuh bersama rekam jejak bantuannya.

**Efek domino:** imbalan jujur membuat penolong yang baik dapat bertahan. Penolong yang bertahan menyelesaikan lebih banyak hasil. Hasil yang selesai menghasilkan bukti. Bukti menumbuhkan kepercayaan. Kepercayaan melahirkan donasi berulang. Donasi berulang memberi lebih banyak orang kesempatan untuk menjadikan menolong sesama sebagai pekerjaan hidupnya.

`Imbalan jujur -> penolong bertahan -> hasil selesai -> bukti terlihat -> kepercayaan tumbuh -> donasi berulang -> lebih banyak orang dibayar untuk menolong`

Inilah efek domino yang ingin diciptakan Ulurin. Penghasilan Kreator tumbuh karena rekam jejak bantuannya semakin kuat, bukan karena penderitaan di dalam kontennya dibuat semakin dramatis.

## Yang diubah Ulurin

Ulurin memiliki dua cara menemukan campaign, tetapi keduanya memakai data campaign yang sama:

1. **Feed Cerita Kebaikan:** pengalaman vertikal berupa video atau foto untuk menemukan cerita nyata dan berdonasi dari layar yang sama.
2. **Marketplace campaign:** tampilan yang bisa dicari dan difilter untuk membandingkan tujuan, lokasi, kreator, progres, dan rekam jejak.

Sebelum konfirmasi, donatur melihat:

- bagian untuk Penerima Manfaat;
- **Imbalan Kreator 0–5%**, dibatasi tier verifikasi;
- alasan dengan bahasa biasa, misalnya verifikasi, transport, koordinasi, dokumentasi, operasional, dan penghargaan wajar atas tenaga kreator;
- **platform fee Ulurin 2%** sebagai baris tersendiri;
- syarat dan waktu pencairan setiap bagian.

Donatur tidak harus memahami wallet, token, atau smart contract. Mereka hanya perlu memahami nominal rupiah, siapa yang menerima, dan alasannya.

## Satu campaign, dari cerita sampai bukti

1. Kreator Kebaikan memverifikasi identitas dan membuat campaign untuk penerima serta kebutuhan tertentu.
2. Kreator memilih imbalan di bawah batas tier dan menjelaskan kegunaannya secara terbuka.
3. Setelah direview, cerita yang sama tampil di feed dan marketplace.
4. Donatur memilih nominal, melihat seluruh pembagian, lalu membayar melalui alur rupiah yang familiar.
5. Bagian penerima tidak ditahan hanya karena kreator belum selesai membuat dokumentasi. Prinsip produk yang dituju adalah **penerima lebih dahulu**.
6. Imbalan kreator tetap terkunci sampai bukti penyaluran diunggah dan direview.
7. Halaman transparansi memuat pembagian, tautan transaksi Stellar, sidik jari bukti, dan status pencairan.
8. Donatur yang benar-benar berdonasi dapat menilai hasil campaign dan mengajukan sengketa bila diperlukan.

Urutan ini menjaga dua kepentingan: bantuan mendesak tidak menunggu produksi konten, tetapi kreator tidak dapat mengambil imbalannya lalu menghilang tanpa laporan.

## Kepercayaan harus bisa bertumbuh

Profil Kreator Kebaikan dirancang untuk menampilkan rekam jejak, bukan hanya jumlah follower:

- tier verifikasi dan batas imbalan;
- campaign aktif, selesai, dibatalkan, dan disengketakan;
- total terkumpul dan total tersalurkan;
- riwayat bukti serta konfirmasi penerima;
- tingkat penyelesaian dan rata-rata waktu mengunggah bukti;
- rating dari donatur terverifikasi;
- koreksi penting atau sengketa yang belum selesai.

Berita berjalan dapat menampilkan event yang benar-benar terkonfirmasi, seperti donasi atau penyaluran yang selesai. Donatur tetap dapat memilih anonim, dan produk produksi tidak boleh mengarang aktivitas untuk terlihat ramai.

## Use case konkret: siapa yang akan memakai Ulurin?

### Pandawara Group: mengubah follower menjadi kerja lapangan yang rutin

[Pandawara Group](https://www.tiktok.com/@pandawaragroup) adalah gerakan lingkungan beranggotakan lima orang dari Bandung yang dikenal melalui konten pembersihan sungai dan pantai. Guinness mencatat **12.137.832 follower TikTok** pada 29 Maret 2026, terbanyak untuk kelompok pembersih lingkungan. ([Guinness World Records](https://www.guinnessworldrecords.com/world-records/782570-most-followers-on-tiktok-for-an-environmental-clean-up-group)) Forbes memasukkan mereka ke **30 Under 30 Asia 2025** dan melaporkan lebih dari **1,3 juta kilogram sampah diangkat**, berdasarkan angka dari kelompok tersebut. ([Forbes](https://www.forbes.com/profile/pandawara-group/))

Pekerjaan mereka membutuhkan truk, bahan bakar, alat pelindung, perlengkapan, kantong sampah, transportasi, dan tenaga lapangan. Profil publik menceritakan perjalanan dari memakai uang pribadi, menerima donasi, lalu memperoleh sponsor CSR per kegiatan. ([Waste4Change](https://waste4change.com/blog/pandawara-group-pemuda-inspiratif-penggiat-bebersih-sungai/)) Itu dapat membiayai sebuah event, tetapi belum otomatis menciptakan operasi bulanan yang stabil.

**Cara Ulurin dipakai:** follower dapat mendukung campaign rutin seperti “empat aksi bersih-bersih bulan ini”. Wallet proyek gerakan menerima alokasi operasional; Imbalan Kreator tetap dipisahkan dan diumumkan; donatur memperoleh invoice bulanan, lokasi kegiatan, dokumentasi hasil sampah, serta receipt transaksi publik. Kepercayaan yang sudah dibangun melalui kerja berubah menjadi pendapatan rutin tanpa menyembunyikan siapa yang dibayar.

### Kreator perbaikan jalan: dari gift livestream menjadi campaign yang dapat dipertanggungjawabkan

- [Nanda / @relawan.jalan.rusak](https://www.tiktok.com/@relawan.jalan.rusak) mendokumentasikan perbaikan sekitar **79 lubang selama dua tahun** di Riau. Salah satu videonya ditonton lebih dari 800.000 kali; pemberitaan menyebut pekerjaan itu memakai uang pribadi dan dukungan follower. ([Catatan Riau](https://catatanriau.com/news/detail/28114/viral-relawan-jalan-rusak-di-pekanbaru-ditegur-rw-saat-tambal-jalan))
- [Suted / @suted.sukarno](https://www.tiktok.com/@suted.sukarno), pengemudi ojek online dari Demak, memperbaiki jalan berbahaya bersama komunitas Maleng Gank. Warganet yang melihat livestream kemudian ikut memberikan donasi. ([Jateng News](https://www.jatengnews.id/2026/02/25/ojol-demak-tambal-jalan-berlubang-dini-hari-tuai-simpati-warganet/))

**Cara Ulurin dipakai:** satu campaign menetapkan ruas jalan, anggaran material, perlengkapan keselamatan, target penyelesaian, dan Imbalan Kreator sebelum orang berdonasi. Sesudah pengerjaan, donatur melihat nota material, bukti sebelum/sesudah, lokasi, dan riwayat penyelesaian kreator. Dukungan tidak lagi bergantung pada apakah livestream kebetulan viral malam itu.

### Bantuan rutin: kebutuhan yang kembali setiap bulan

| Penerima rutin | Yang perlu terus dibiayai | Yang dilihat donatur setiap siklus |
|---|---|---|
| Panti asuhan / rumah anak | Makan, sekolah dan perlengkapan, kesehatan, kebersihan, listrik, serta pengasuh | Ringkasan pengeluaran bulanan, invoice yang sudah disensor, update kegiatan, dan konfirmasi lembaga |
| Panti jompo | Makan, obat, kebutuhan perawatan lansia, pemeriksaan, transportasi, listrik, dan caregiver | Bukti pembelian, catatan pelayanan, konfirmasi panti, dan kebutuhan lanjutan |
| Dapur makan gratis | Bahan makanan, gas, kemasan, transport dapur, peralatan, dan operasional harian | Jumlah porsi, tanggal penyaluran, invoice bahan, dokumentasi yang bermartabat, dan sisa dana |
| Shelter hewan | Pakan, dokter hewan, sterilisasi, obat, sewa, dan transport rescue | Invoice dokter, perkembangan per hewan, konfirmasi shelter, dan jumlah hewan dalam perawatan |
| Rumah singgah pasien / pusat rehabilitasi | Tempat tinggal sementara, makan, transport berobat, terapi, obat, dan staf | Tingkat hunian, bukti layanan, dokumen medis tersensor, dan laporan biaya |
| Bantuan hukum / riset independen | Penerimaan kasus, biaya perkara, transport, jam profesional, pengumpulan data, dan publikasi | Laporan milestone, bukti kasus atau riset tersensor, pengeluaran, dan hasil kerja |

Program publik membuktikan kebutuhan tersebut terus berulang: [Panti Asuhan Indonesia](https://pantiasuhan.or.id/) mengelompokkan campaign pangan dan pendidikan; sebuah [campaign Dompet Dhuafa](https://digital.dompetdhuafa.org/donasi/lansiapantijompo) mendokumentasikan bantuan pangan bagi 30 lansia; dan [program Rumah Makan Gratis Rumah Cinta Qur'an](https://rumahcintaquran.or.id/rumah-makan-gratis/) melayani siapa pun yang membutuhkan makan. Peran Ulurin adalah menjadikan setiap bulan satu siklus pendanaan dan bukti yang transparan, bukan memaksa lembaga mulai dari nol setiap kali.

### Kasus sekali jalan dan keadaan darurat

Ulurin juga mendukung campaign dengan akhir yang jelas: operasi atau obat, motor driver yang dicuri, dukungan pendapatan untuk keluarga yang ditinggalkan, biaya hukum bagi orang yang terzalimi, tanggap bencana, atau rescue dan perawatan dokter hewan. Campaign sekali jalan memiliki target, tenggat, penerima, kondisi selesai, dan laporan penutupan.

Semua orang dan gerakan di atas adalah contoh publik untuk membumikan kategori produk. Mereka **bukan mitra atau pengguna Ulurin yang diklaim**. Lihat [peta use case lengkap](docs/USE-CASES.md).

## Kenapa Stellar berada di bawahnya

Stellar adalah lapisan akuntabilitas, bukan kepribadian produk.

- **Smart contract Soroban** dapat memegang dana campaign, menegakkan batas Imbalan Kreator, memisahkan alokasi, dan mengatur syarat pencairan.
- **Public ledger** membuat perpindahan dana di dalam kontrak dapat diverifikasi secara independen.
- Penyelesaian cepat dan murah membuat donasi kecil lebih masuk akal.
- Receipt publik menghubungkan campaign yang mudah dibaca manusia dengan bukti transaksi tanpa memaksa donatur mengurus seed phrase.

UI utama tetap memakai rupiah dan bahasa familiar. Hash transaksi berada di bagian transparansi yang dapat dibuka, bukan di pusat pengalaman emosional.

## Batas jujur: Xendit bukan Stellar anchor

Prototype direncanakan memakai **Xendit Sandbox** untuk menguji alur pembayaran dan payout yang familiar. Itu tidak menjadikan Xendit sebagai Stellar anchor berlisensi, tidak otomatis mengubah IDR menjadi USDC, dan tidak mengubah demo testnet menjadi sistem uang sungguhan.

Peluncuran produksi masih memerlukan model custody, mitra fiat/crypto berlisensi jika relevan, konversi aset, rekonsiliasi, perlindungan konsumen, serta pembagian tanggung jawab atas transfer yang gagal atau disengketakan.

## Yang dapat dan tidak dapat dibuktikan ledger

On-chain dapat membuktikan akun tertentu mengirim aset tertentu, kontrak menjalankan pembagian, dan pencairan terjadi pada waktu yang tercatat.

On-chain tidak otomatis membuktikan identitas penerima, kebenaran invoice, penyerahan obat, atau dampak program. Klaim tersebut masih membutuhkan KYC, review bukti, konfirmasi penerima, moderasi, dan mekanisme sengketa.

Batas ini harus tampil di dekat setiap receipt publik. Produk menjadi lebih dipercaya ketika tepat dalam menjelaskan arti buktinya.

## Misi: cara Ulurin mencapainya

1. Memberi penggalang akar rumput jalur jujur untuk memperoleh penghasilan dari pekerjaan terverifikasi.
2. Memberi donatur persetujuan yang benar-benar sadar sebelum membayar dan bukti yang tahan lama setelahnya.
3. Melindungi martabat, urgensi, serta kendali penerima atas cerita mereka.
4. Mengubah batas penggalangan dana yang sudah ada menjadi aturan transaksi yang sulit dilanggar.
5. Membangun reputasi portabel bagi orang yang berulang kali menyelesaikan kerja sosial.

## Dokumen produk

- **Aplikasi live:** [ulurin-test.vercel.app](https://ulurin-test.vercel.app)
- **Source kontrak dan tesnya:** [`contracts/ulurin-vault`](contracts/ulurin-vault) — 18 tes Rust untuk jalur uang, batas 10%, dan tangga tier
- **Jejak deployment:** [DEPLOYMENTS.md](DEPLOYMENTS.md) — setiap klaim di atas sebagai hash transaksi yang bisa diperiksa
- **Prototype lokal yang dapat dijalankan:** [`apps/ulurin`](apps/ulurin)
- **Konsep bisnis:** [Bahasa Indonesia](docs/KONSEP.md) · [English](docs/KONSEP.en.md)
- **Use case konkret:** [Bahasa Indonesia](docs/USE-CASES.md) · [English](docs/USE-CASES.en.md)
- [Deck submission APAC Stellar Hackathon](docs/pitch/Ulurin-APAC-Stellar-Hackathon.pdf): PDF delapan slide yang dibekukan sesuai versi submission.
- [Product brief](docs/PRODUCT-BRIEF.md): pengguna, permukaan produk, alur lengkap, trust model, dan ukuran keberhasilan.
- [Keputusan dan pertanyaan terbuka](docs/DECISIONS.md): keputusan versi ini dan hal yang wajib selesai sebelum implementasi.

## Sumber dan konteks

- [Repo publik Ulurin versi hackathon](https://github.com/farreledwin/ulurin)
- [BPK: UU No. 9 Tahun 1961](https://peraturan.bpk.go.id/Details/51166/uu-no-9-tahun-1961)
- [BPK: PP No. 29 Tahun 1980](https://peraturan.bpk.go.id/Download/56955/PP%20NO%2029%20TH%201980.pdf)
- [Kompas: dakwaan dana Boeing ACT](https://nasional.kompas.com/read/2022/11/15/14161711/dakwaan-bos-act-pencairan-dana-sosial-boeing-hanya-lewat-whatsapp)
- [Vice: vonis ACT dan 6 dari 70 program](https://www.vice.com/en/article/boeing-embezzlement-lion-air-indonesia/)
- [Detik: kontroversi donasi Cak Budi](https://news.detik.com/berita/d-3488851/heboh-pengakuan-cak-budi-pakai-uang-donasi-untuk-beli-fortuner)
- [Detik: survei Median setelah kasus ACT](https://news.detik.com/berita/d-6210306/survei-median-pakai-gform-44-7-responden-tak-percaya-lembaga-serupa-act)
- [JPNN: BAZNAS tentang perpindahan kepercayaan ke jalur perorangan](https://www.jpnn.com/news/buntut-kasus-act-baznas-prediksi-jumlah-donasi-masyarakat-berkurang)

---

Ulurin berasal dari *ulurkan tangan*. Janjinya sederhana: bantuannya sampai, pekerjaan di baliknya dibayar secara wajar, dan tidak ada orang yang harus menebak ke mana uangnya pergi.
