"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "./I18n";
import { useCart } from "./Cart";
import LangSwitch from "./LangSwitch";
import Logo from "./Logo";

export default function Header({ email }: { email: string | null }) {
  const { t } = useI18n();
  const { items } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/catalog", label: t("nav.catalog") },
    { href: "/premium", label: t("nav.premium") },
  ];
  const on = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  const logout = (
    <form action="/auth/signout" method="post">
      <button className="btn sm ghost" type="submit">{t("nav.logout")}</button>
    </form>
  );

  return (
    <header className="hdr">
      <div className="wrap">
        <Link href="/" className="logo"><Logo /> Qolip</Link>
        <nav className="nav" aria-label="main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={on(l.href) ? "on" : ""}>{l.label}</Link>
          ))}
        </nav>
        <span className="sp" />
        <div className="tools">
          <span className="hide-m"><LangSwitch /></span>
          <Link href="/cart" className="btn sm cartlink" aria-label={t("nav.cart")}>
            {t("nav.cart")}
            {items.length > 0 && <span className="badge">{items.length}</span>}
          </Link>
          {email ? (
            <>
              <Link href="/account" className="btn sm hide-m">{t("nav.account")}</Link>
              <span className="hide-m">{logout}</span>
            </>
          ) : (
            <Link href="/login" className="btn sm primary hide-m">{t("nav.login")}</Link>
          )}
          <button className="btn sm burger" aria-label={t("nav.menu")} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <div className="drawer">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          {email ? (
            <>
              <Link href="/account">{t("nav.account")}</Link>
              <form action="/auth/signout" method="post"><button className="link" type="submit">{t("nav.logout")}</button></form>
            </>
          ) : (
            <Link href="/login">{t("nav.login")}</Link>
          )}
          <div><LangSwitch /></div>
        </div>
      )}
    </header>
  );
}
