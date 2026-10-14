import { cookies } from "next/headers";
import type { Lang } from "./demo-data";
import { makeT } from "./i18n";

export async function getLang(): Promise<Lang> {
  const c = await cookies();
  return c.get("lang")?.value === "en" ? "en" : "uz";
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: makeT(lang) };
}
