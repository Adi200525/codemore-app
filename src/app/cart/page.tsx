import { getT } from "@/lib/lang";
import { getUser } from "@/lib/auth";
import CartView from "@/components/CartView";

export const metadata = { title: "Cart", robots: { index: false } };

export default async function CartPage() {
  const { t } = await getT();
  const user = await getUser();
  return (
    <div className="wrap pt">
      <h1 style={{ fontSize: "2.2rem" }}>{t("cart.title")}</h1>
      <CartView loggedIn={!!user} />
    </div>
  );
}
