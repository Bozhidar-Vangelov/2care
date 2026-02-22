import type { Metadata } from "next";

const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:4200";
const SITE_NAME = "2Care";
const DEFAULT_DESCRIPTION =
  "Track your baby's feeding, sleep, diaper changes, and milestones — all in one place.";
const OG_IMAGE = "/og-image.png";

interface CreateMetadataOptions {
  title: string;
  description?: string;
  noIndex?: boolean;
  path?: string;
  image?: string;
}

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  noIndex = false,
  path = "/",
  image = OG_IMAGE,
}: CreateMetadataOptions): Metadata {
  const canonicalUrl = `${APP_URL}${path}`;
  const ogTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
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

    openGraph: noIndex
      ? undefined
      : {
          title: ogTitle,
          description,
          url: canonicalUrl,
          siteName: SITE_NAME,
          type: "website",
          locale: "en_US",
          images: [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: ogTitle,
            },
          ],
        },

    twitter: noIndex
      ? undefined
      : {
          card: "summary_large_image",
          title: ogTitle,
          description,
          images: [image],
        },
  };
}
