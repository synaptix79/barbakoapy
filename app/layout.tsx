import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Barbakóa | Texas Barbecue Paraguay",
    template: "%s | Barbakóa"
  },
  description: siteConfig.description,
  applicationName: "Barbakóa",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Barbakóa | Texas Barbecue Paraguay",
    description: siteConfig.description,
    url: "/",
    siteName: "Barbakóa",
    locale: "es_PY",
    type: "website",
    images: [
      {
        url: "/assets/barbakoa-logo.png",
        width: 512,
        height: 512,
        alt: "Logo de Barbakóa"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Barbakóa | Texas Barbecue Paraguay",
    description: siteConfig.description,
    images: ["/assets/barbakoa-logo.png"]
  },
  icons: {
    icon: "/assets/barbakoa-logo.png",
    apple: "/assets/barbakoa-logo.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#1A1512",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PY">
      <body>{children}</body>
    </html>
  );
}
