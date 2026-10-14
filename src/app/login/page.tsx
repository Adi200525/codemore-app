import { getT } from "@/lib/lang";
import { supabaseConfigured } from "@/lib/config";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const { t } = await getT();
  return (
    <div className="wrap">
      <div className="auth rise">
        <div className="panel cropbox">
          <h1 style={{ fontSize: "1.8rem" }}>{t("auth.title")}</h1>
          <p className="muted" style={{ margin: 0 }}>{t("auth.sub")}</p>
          <LoginForm next={next || "/account"} enabled={supabaseConfigured()} />
        </div>
      </div>
    </div>
  );
}
