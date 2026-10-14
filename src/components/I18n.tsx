"use client";
import { createContext, useContext, useMemo } from "react";
import type { Lang } from "@/lib/demo-data";
import { makeT, type T } from "@/lib/i18n";

const Ctx = createContext<{ lang: Lang; t: T }>({ lang: "uz", t: makeT("uz") });

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const v = useMemo(() => ({ lang, t: makeT(lang) }), [lang]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
