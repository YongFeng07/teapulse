import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { UnifiedNavbar } from "@/components/layout/unified-navbar";
import AnnouncementBanner from "@/components/landing/AnnouncementBanner";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { SchemaOrg } from "@/components/seo/schema-org";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { BackToTop } from "@/components/ui/back-to-top";

export const metadata: Metadata = {
  metadataBase: new URL("https://teapulse.com"),
  title: "Tea Pulse — Not Just Tea. A Whole New Pulse.",
  description: "Luxury handcrafted tea experiences designed for the rhythm of modern life. Order ahead, earn rewards, skip the queue.",
  keywords: ["tea pulse", "luxury milk tea", "boba tea", "premium tea", "matcha", "bubble tea", "Kuala Lumpur"],
  openGraph: {
    title: "Tea Pulse — Not Just Tea. A Whole New Pulse.",
    description: "Luxury handcrafted tea experiences designed for the rhythm of modern life.",
    type: "website",
    siteName: "Tea Pulse",
    images: [{
      url: "https://images.pexels.com/photos/19996404/pexels-photo-19996404.jpeg?auto=compress&cs=tinysrgb&w=1200",
      width: 1200, height: 630, alt: "Tea Pulse — Premium Luxury Tea",
    }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0E0E0E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: "#0E0E0E", color: "#F5EFE6" }}>
        <SkipToContent />
        <SchemaOrg />
        <Providers>
          <OnboardingFlow />
          <UnifiedNavbar />
          <AnnouncementBanner />
          <main id="main-content" className="min-h-screen">{children}</main>
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
