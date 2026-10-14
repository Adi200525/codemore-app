"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { useCart } from "./Cart";

type Props = {
  id: string; slug: string; name: string; priceCents: number;
  loggedIn: boolean; owned: boolean; premium: boolean;
};

export default function BuyBox({ id, slug, name, priceCents, loggedIn, owned, premium }: Props) {
  const { t } = useI18n();
  const { add, has } = useCart();
  const router = useRouter();
  const inCart = has(id);

  if (owned || premium) {
    return (
      <>
        <p className="small muted">{owned ? t("p.owned") : t("p.included")}</p>
        <a className="btn primary block" href={`/api/download/${id}`}>{t("p.download")}</a>
      </>
    );
  }
  return (
    <>
      <button
        className="btn primary block"
        onClick={() => {
          add({ id, slug, name, priceCents });
          router.push("/cart");
        }}
      >
        {t("p.buy")}
      </button>
      <button className="btn block" disabled={inCart} onClick={() => add({ id, slug, name, priceCents })}>
        {inCart ? t("p.added") : t("p.add")}
      </button>
      <Link href="/premium" className="small muted">{t("p.getPremium")} →</Link>
      {!loggedIn && <p className="small muted">{t("p.loginToDownload")}</p>}
    </>
  );
}
