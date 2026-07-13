// Bagibagi — Indonesia-first preview seed data.
// NOT real causes, NOT live, NOT on-chain. Numbers are IDR-first app units;
// the Money component renders them in the user's selected display currency.

import type { Circle } from "./types";

export const SEED_CIRCLES: Circle[] = [
  {
    id: "banjir-jakarta-utara",
    title: "Banjir Jakarta Utara - dapur umum untuk 200 keluarga",
    organizer: "Karang Taruna RW 06",
    organizerLocation: "Jakarta Utara, ID",
    category: "disaster",
    story:
      "Banjir besar di RW 06 membuat 200 keluarga mengungsi ke balai warga. Listrik mati tiga hari. Kami membuka dapur umum 24 jam untuk warga yang masih bertahan di rumah dan di pengungsian.\n\nSetiap rupiah yang masuk lewat Bagibagi harus terlihat transparan saat public launch. Untuk sekarang ini adalah pratinjau: kontribusi belum dipungut.\n\nTerima kasih untuk teman-teman di seluruh nusantara dan diaspora.",
    raisedAmount: 96_750_000,
    targetAmount: 200_000_000,
    donorCount: 421,
    daysRemaining: 11,
    coverGradient: ["#1D4ED8", "#3B82F6"],
    recentDonations: [
      { id: "d1", donorLabel: "Anonymous", amount: 150_000, whenLabel: "1 jam lalu" },
      { id: "d2", donorLabel: "Putri W.", amount: 500_000, whenLabel: "4 jam lalu", note: "Dari Surabaya. Tetap semangat." },
      { id: "d3", donorLabel: "Anonymous", amount: 1_000_000, whenLabel: "kemarin" },
      { id: "d4", donorLabel: "Anggi P.", amount: 750_000, whenLabel: "kemarin" },
    ],
  },
  {
    id: "pak-rahmat-dialisis",
    title: "Pak Rahmat butuh 12 sesi dialisis bulan ini",
    organizer: "Keluarga Pak Rahmat",
    organizerLocation: "Bandung, ID",
    category: "medical",
    story:
      "Pak Rahmat, 58 tahun, baru didiagnosis gagal ginjal stadium akhir. BPJS membantu sebagian biaya, tapi keluarga masih perlu menutup transportasi, obat pendamping, dan biaya sesi tambahan selama menunggu jadwal rujukan.\n\nKami akan mengunggah struk dan update setiap milestone saat Bagibagi live. Di pratinjau ini, kamu bisa melihat bagaimana pembagian donasi dan allowance operasional ditampilkan sebelum donatur berkomitmen.",
    raisedAmount: 62_300_000,
    targetAmount: 180_000_000,
    donorCount: 87,
    daysRemaining: 25,
    coverGradient: ["#059669", "#10B981"],
    recentDonations: [
      { id: "d1", donorLabel: "Anonymous", amount: 300_000, whenLabel: "6 jam lalu" },
      { id: "d2", donorLabel: "Bima G.", amount: 1_000_000, whenLabel: "kemarin", note: "Semoga Pak Rahmat segera stabil." },
      { id: "d3", donorLabel: "Ruth T.", amount: 200_000, whenLabel: "2 hari lalu" },
      { id: "d4", donorLabel: "Anonymous", amount: 5_000_000, whenLabel: "3 hari lalu" },
    ],
    allowance: {
      percentage: 5,
      tier: 1,
      organizerName: "Keluarga Pak Rahmat",
      proofRequired: true,
      escrowed: true,
      accruedAmount: 3_115_000,
    },
  },
  {
    id: "perpustakaan-desa-gunungkidul",
    title: "Bangun perpustakaan desa untuk 300 anak di Gunungkidul",
    organizer: "Komunitas Guru Desa",
    organizerLocation: "Gunungkidul, ID",
    category: "education",
    story:
      "Sekolah dasar di desa kami hanya punya beberapa rak buku lama. Anak-anak bergantian membaca buku yang sama setiap minggu. Ruang kosong di balai dusun sudah disiapkan; kami butuh rak, buku bacaan, cat, dan kipas.\n\nIni campaign jangka menengah. Setiap pembelian buku dan material akan dipublikasikan sebagai bukti saat Bagibagi live.",
    raisedAmount: 38_900_000,
    targetAmount: 150_000_000,
    donorCount: 54,
    daysRemaining: 60,
    coverGradient: ["#4C2F8A", "#7C3AED"],
    recentDonations: [
      { id: "d1", donorLabel: "Anonymous", amount: 500_000, whenLabel: "kemarin" },
      { id: "d2", donorLabel: "Ibu Linda", amount: 2_000_000, whenLabel: "3 hari lalu", note: "Untuk anak-anak yang suka membaca." },
      { id: "d3", donorLabel: "Anonymous", amount: 100_000, whenLabel: "4 hari lalu" },
    ],
    allowance: {
      percentage: 8,
      tier: 2,
      organizerName: "Komunitas Guru Desa",
      proofRequired: true,
      escrowed: true,
      accruedAmount: 3_112_000,
    },
  },
  {
    id: "motor-ojol-hilang-bekasi",
    title: "Bantu driver ojol Bekasi mengganti motor yang hilang",
    organizer: "Tetangga Pak Deni",
    organizerLocation: "Bekasi, ID",
    category: "family",
    story:
      "Motor Pak Deni hilang saat ia mengantar pesanan malam. Motor itu satu-satunya alat kerja keluarga. Tanpa motor, penghasilan harian berhenti dan cicilan sekolah dua anaknya ikut terancam.\n\nDana akan dipakai untuk DP motor pengganti, helm, dan biaya administrasi. Bukti pembelian akan dipublikasikan saat Bagibagi live.",
    raisedAmount: 47_200_000,
    targetAmount: 75_000_000,
    donorCount: 138,
    daysRemaining: 9,
    coverGradient: ["#2E5DA0", "#0EA5E9"],
    recentDonations: [
      { id: "d1", donorLabel: "Anonymous", amount: 500_000, whenLabel: "3 jam lalu" },
      { id: "d2", donorLabel: "Marvin", amount: 1_500_000, whenLabel: "kemarin", note: "Semoga cepat narik lagi, Pak." },
      { id: "d3", donorLabel: "Anonymous", amount: 300_000, whenLabel: "2 hari lalu" },
    ],
  },
  {
    id: "tambal-jalan-demak",
    title: "Relawan tambal jalan berlubang di Demak",
    organizer: "@relawan.jalan",
    organizerLocation: "Demak, ID",
    category: "community",
    story:
      "Tim kecil kami menambal lubang jalan yang sering membuat pengendara jatuh. Biaya aspal dingin, rompi, cone, dan transport selama ini patungan sendiri.\n\nBagibagi cocok untuk kerja seperti ini: donor melihat biaya operasional sejak awal, sementara setiap pembelian material dan lokasi pengerjaan bisa dilaporkan terbuka.",
    raisedAmount: 24_400_000,
    targetAmount: 60_000_000,
    donorCount: 92,
    daysRemaining: 22,
    coverGradient: ["#9C4221", "#F97316"],
    recentDonations: [
      { id: "d1", donorLabel: "Anonymous", amount: 250_000, whenLabel: "kemarin" },
      { id: "d2", donorLabel: "Ira R.", amount: 1_000_000, whenLabel: "2 hari lalu", note: "Biar jalan kampung lebih aman." },
      { id: "d3", donorLabel: "Anonymous", amount: 500_000, whenLabel: "4 hari lalu" },
    ],
    allowance: {
      percentage: 7,
      tier: 1,
      organizerName: "@relawan.jalan",
      proofRequired: true,
      escrowed: true,
      accruedAmount: 1_708_000,
    },
  },
  {
    id: "zine-aksara-nusantara",
    title: "Cetak 1.000 zine belajar aksara Nusantara gratis",
    organizer: "@kertasbaik",
    organizerLocation: "Yogyakarta, ID",
    category: "creator",
    story:
      "Saya membuat zine kecil untuk mengenalkan aksara Nusantara ke anak-anak sekolah dasar. Target berikutnya: cetak 1.000 eksemplar dan kirim gratis ke taman baca di Jawa, Bali, dan Nusa Tenggara.\n\nDi Bagibagi, kreator sosial bisa menjelaskan biaya kerja secara terbuka. Penerima tetap prioritas, allowance operasional hanya berjalan jika dikonfigurasi dan berbukti.",
    raisedAmount: 31_800_000,
    targetAmount: 80_000_000,
    donorCount: 116,
    daysRemaining: 28,
    coverGradient: ["#B45309", "#F59E0B"],
    recentDonations: [
      { id: "d1", donorLabel: "Anonymous", amount: 250_000, whenLabel: "5 jam lalu" },
      { id: "d2", donorLabel: "Nadia", amount: 750_000, whenLabel: "kemarin", note: "Untuk taman baca di timur." },
      { id: "d3", donorLabel: "Anonymous", amount: 500_000, whenLabel: "2 hari lalu" },
    ],
  },
];

export function getCircle(id: string): Circle | undefined {
  return SEED_CIRCLES.find((c) => c.id === id);
}
