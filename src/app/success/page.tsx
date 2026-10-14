import Link from "next/link";
import { getT } from "@/lib/lang";
import ClearCart from "@/components/ClearCart";

export const metadata = { title: "Thank you", robots: { index: false } };

export default async function Success() {
  const { t } = await getT();
  return (
    <div className="wrap pt center">
      <ClearCart />
      <span className="kicker">✓</span>
      <h1>{t("ok.title")}</h1>
      <p className="muted">{t("ok.text")}</p>
      <Link className="btn primary" href="/account">{t("ok.go")}</Link>
    </div>
  );
}
