import type { Metadata } from "next";
import { getLocaleData } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnnouncementBar } from "@/components/announcement-bar";
import "./globals.css";
import "./chrome.css";
import "./homepage.css";

export const metadata: Metadata = {
  title: { default: "YOI KIJI — The Art of Textile Living", template: "%s | YOI KIJI" },
  description: "Thoughtfully considered textiles for the way you live.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocaleData();
  return <html lang={locale.code} dir={locale.direction}>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </head>
    <body>
      <AnnouncementBar />
      <SiteHeader />
      {children}
      <SiteFooter />
    </body>
  </html>;
}
