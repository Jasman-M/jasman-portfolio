import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import CursorGlow from "@/components/CursorGlow";
import { profile } from "@/data/content";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jasman Mander",
  description: profile.positioning,
  openGraph: {
    title: "Jasman Mander",
    description: profile.positioning,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1b1b19" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
  ],
};

// Runs before paint so the stored theme doesn't flash.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        <CursorGlow />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
