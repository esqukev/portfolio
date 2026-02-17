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

export const metadata: Metadata = {
  title: "Star Dev | Portfolio",
  description: "Star Dev - Web Developer & Designer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${leckerliOne.variable} ${caveat.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="site-bg" />
        {children}
      </body>
    </html>
  );
}