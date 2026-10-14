import Link from "next/link";
import { getT } from "@/lib/lang";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="wrap pt center">
      <p className="kicker">404</p>
      <h1>{t("nf.title")}</h1>
      <p className="muted">{t("nf.text")}</p>
      <Link className="btn primary" href="/">{t("nav.home")}</Link>
    </div>
  );
}
