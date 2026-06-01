import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const TITLE = "55 Seconds — Le jeu du profil finançable";
const DESCRIPTION =
  "Transforme 0,18 € en profil finançable en 55 secondes dans un jeu de stratégie entrepreneuriale rapide, social et addictif. Simulation fictive, réflexes réels.";

export const metadata: Metadata = {
  metadataBase: new URL("https://55seconds.app"),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "55 Seconds",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/icons/app-icon.png",
    apple: "/assets/icons/app-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "55 Seconds",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "55 Seconds",
    images: [{ url: "/assets/og/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#05030A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
