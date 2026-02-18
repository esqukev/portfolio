import type { Metadata } from "next";
import { Geist, Geist_Mono, Leckerli_One, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const leckerliOne = Leckerli_One({
  weight: "400",
  variable: "--font-leckerli-one",
  subsets: ["latin"],
});

const caveat = Caveat({
  weight: ["400"],
  variable: "--font-caveat",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001");

const ogDescription = "Creating bold modern and innovative web experiences.";
const ogImageUrl = `${siteUrl.replace(/\/$/, "")}/meta.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Kevin Bermudez | StarDev | Portfolio",
  description: ogDescription,
  authors: [{ name: "Kevin Bermudez" }],
  openGraph: {
    title: "Kevin Bermudez | StarDev | Portfolio",
    description: ogDescription,
    url: siteUrl,
    siteName: "Kevin Bermudez | StarDev Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Kevin Bermudez StarDev Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Bermudez | StarDev | Portfolio",
    description: ogDescription,
    images: [ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning: Prevents hydration errors caused by browser extensions that modify the DOM */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${leckerliOne.variable} ${caveat.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
