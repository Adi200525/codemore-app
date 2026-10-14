"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLang } from "@/app/actions/lang";
import { useI18n } from "./I18n";

export default function LangSwitch() {
  const { lang, t } = useI18n();
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      className="btn sm ghost"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await setLang(lang === "uz" ? "en" : "uz");
          router.refresh();
        })
      }
    >
      {t("lang.switch")}
    </button>
  );
}
