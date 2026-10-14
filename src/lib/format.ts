import type { Lang } from "./demo-data";

export function money(cents: number, lang: Lang = "en") {
  return new Intl.NumberFormat(lang === "uz" ? "uz-UZ" : "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function num(n: number, lang: Lang = "en") {
  return new Intl.NumberFormat(lang === "uz" ? "uz-UZ" : "en-US").format(n);
}

export function dateFmt(iso: string | number | Date, lang: Lang = "en") {
  return new Date(iso).toLocaleDateString(lang === "uz" ? "uz-UZ" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
