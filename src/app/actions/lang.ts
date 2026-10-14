"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLang(lang: string) {
  const c = await cookies();
  c.set("lang", lang === "en" ? "en" : "uz", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
}
