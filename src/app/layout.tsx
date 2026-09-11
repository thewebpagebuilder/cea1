import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/chrome";
import { getSession } from "@/lib/auth";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chico Equestrian Association — Ride Bidwell Park",
    template: "%s · Chico Equestrian Association",
  },
  description:
    "CEA is a volunteer-run nonprofit preserving equestrian access to Bidwell Park since 1976. Trail guides, conditions, events, business directory, and membership.",
  metadataBase: new URL("https://chicoequestrianassociation.com"),
  openGraph: {
    title: "Chico Equestrian Association",
    description:
      "Preserving equestrian access to Bidwell Park through stewardship, education, and community.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession().catch(() => null);
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable}`}
      style={
        {
          "--font-serif": serif.style.fontFamily,
          "--font-sans": sans.style.fontFamily,
        } as CSSProperties
      }
    >
      <body className="min-h-screen bg-cream font-sans text-charcoal antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header session={session} />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
