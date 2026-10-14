import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { SITE, stripeConfigured, stripeLive } from "@/lib/config";
import { getLang } from "@/lib/lang";
import { getUser } from "@/lib/auth";
import { I18nProvider } from "@/components/I18n";
import { CartProvider } from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { makeT } from "@/lib/i18n";

const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--font-display", display: "swap" });
const body = Figtree({ subsets: ["latin", "latin-ext"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — raqamli mahsulotlar`, template: `%s · ${SITE.name}` },
  description: "UI kits, web templates, code, ebooks, icons, slides and courses. Buy once or go Premium.",
  openGraph: { siteName: SITE.name, type: "website" },
};
export const viewport: Viewport = { themeColor: "#f4f7fb", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const user = await getUser();
  const t = makeT(lang);
  const testMode = stripeConfigured() && !stripeLive();
  return (
    <html lang={lang} className={`${display.variable} ${body.variable}`}>
      <body>
        <I18nProvider lang={lang}>
          <CartProvider>
            {testMode && <div className="test-banner">{t("banner.test")}</div>}
            <Header email={user?.email ?? null} />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
