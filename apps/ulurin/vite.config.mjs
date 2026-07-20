import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [
    react(),
    VitePWA({
      // Bukan autoUpdate. Semua state di app ini cuma useState (receipt, form
      // donasi, transaksi testnet yang lagi jalan) — reload yang datang sendiri
      // bisa membunuh transaksi yang sudah dikirim ke chain. User yang memilih.
      registerType: "prompt",
      includeAssets: ["icons/ulurin-192.png", "icons/ulurin-512.png"],
      // HTML dari network dulu, precache cuma jaring offline-nya.
      //
      // Default workbox melayani navigasi dari index.html yang di-precache, jadi
      // kunjungan pertama sesudah deploy dapat HTML LAMA yang menunjuk hash aset
      // LAMA — app lama yang utuh dan meyakinkan. Aset ber-hash tetap precache
      // (isinya immutable), yang basi cuma HTML-nya.
      //
      // Ketiga kunci di bawah satu paket, jangan dipisah:
      //  - navigateFallback:null  -> matikan NavigationRoute yang cache-first
      //  - directoryIndex:null    -> tanpa ini "/" masih dicocokkan ke varian
      //                              "/index.html" dan kena precache duluan, jadi
      //                              "/jelajahi" segar tapi "/" tetap basi
      //  - runtimeCaching         -> Router first-match-wins, rute ini didaftar
      //                              paling akhir; kalau dua di atas masih hidup
      //                              rute ini tidak pernah jalan
      workbox: {
        navigateFallback: null,
        directoryIndex: null,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "ulurin-html",
              networkTimeoutSeconds: 3,
              // Offline tetap jalan: kalau network gagal, jatuh ke index.html
              // yang di-precache — termasuk untuk rute yang belum pernah dibuka.
              precacheFallback: { fallbackURL: "index.html" },
            },
          },
        ],
      },
      manifest: {
        name: "Ulurin",
        short_name: "Ulurin",
        description: "Menolong sesama, dijadikan profesi yang jujur.",
        theme_color: "#0b1713",
        background_color: "#0b1713",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons/ulurin-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/ulurin-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    // vitest tidak bisa resolve virtual module vite-plugin-pwa (id-nya
    // "/@vite-plugin-pwa/virtual:pwa-register/react" -> dianggap path file).
    // Tanpa alias ini App.test.jsx gagal load sama sekali.
    alias: {
      "virtual:pwa-register/react": fileURLToPath(
        new URL("./src/test/pwa-register-stub.js", import.meta.url),
      ),
    },
  },
});
