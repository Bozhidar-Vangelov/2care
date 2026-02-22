import { Providers } from "@/components/providers";
import type { Metadata, Viewport } from "next";
import { Nunito, Roboto_Mono } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:4200";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    template: "%s | 2Care",
    default: "2Care — Baby Care Tracker",
  },
  description:
    "Track your baby's feeding, sleep, diaper changes, and milestones — all in one place.",
  keywords: [
    "baby tracker",
    "baby care",
    "newborn tracker",
    "feeding tracker",
    "sleep tracker",
    "diaper tracker",
    "milestone tracker",
    "parenting app",
  ],
  authors: [{ name: "2Care" }],
  creator: "2Care",

  openGraph: {
    type: "website",
    siteName: "2Care",
    title: "2Care — Baby Care Tracker",
    description:
      "Track your baby's feeding, sleep, diaper changes, and milestones — all in one place.",
    url: APP_URL,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "2Care — Baby Care Tracker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "2Care — Baby Care Tracker",
    description:
      "Track your baby's feeding, sleep, diaper changes, and milestones — all in one place.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: APP_URL,
  },

  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${nunito.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
