import Link from "next/link";
import { SITE } from "@/lib/config";
import { getT } from "@/lib/lang";

export default async function Footer() {
  const { t } = await getT();
  return (
    <footer className="ftr">
      <div className="wrap">
        <div>
          <b>{SITE.name}</b>
          <p className="muted small">© {new Date().getFullYear()} {SITE.company}. {t("foot.rights")}</p>
        </div>
        <nav>
          <Link href="/legal/terms">{t("foot.terms")}</Link>
          <Link href="/legal/privacy">{t("foot.privacy")}</Link>
          <Link href="/legal/refund">{t("foot.refund")}</Link>
          <a href={`mailto:${SITE.email}`}>{t("foot.contact")}</a>
        </nav>
      </div>
    </footer>
  );
}
