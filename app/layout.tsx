import type { Metadata } from "next";
import { Playfair_Display, Sora } from "next/font/google";
import "./globals.css";
import { DESCRIPTION, SITE_NAME, SITE_URL, VENUE_NAME } from "./site";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const TITLE = `${SITE_NAME} | ${VENUE_NAME}, Music Performance Studio in Markham`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "A&K Foundation",
    "AK Foundation",
    VENUE_NAME,
    "Markham non-profit",
    "performance studio Markham",
    "Carnatic music Toronto",
    "concert venue Markham",
    "traditional arts",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_CA",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body className={`${sora.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
