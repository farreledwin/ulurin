import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bagibagi, donation marketplace for philantropreneurs",
  description:
    "A donation marketplace where organizers can transparently set a 0%-10% operational allowance.",
  appleWebApp: { capable: true, title: "Bagibagi", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    siteName: "Bagibagi",
    title: "Bagibagi, donation marketplace for philantropreneurs",
    description:
      "Discover campaigns, start a circle, and show every donor the donation split before they pledge.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bagibagi",
    description:
      "Transparent donation marketplace with optional 0%-10% organizer allowance.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">
        <I18nProvider>
          <div className="sl-shell flex min-h-dvh w-full flex-col lg:items-center lg:justify-center">
            <div
              className="relative mx-auto flex h-svh w-full max-w-[460px] flex-col overflow-hidden lg:h-[860px] lg:max-h-[94vh] lg:min-h-0 lg:flex-none lg:rounded-[40px] lg:shadow-[0_60px_120px_-30px_rgba(11,18,32,0.55)] lg:ring-1 lg:ring-black/10"
              style={{ background: "#F4F6FB" }}
            >
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
