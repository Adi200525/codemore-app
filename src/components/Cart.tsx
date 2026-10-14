"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CartItem = { id: string; slug: string; name: string; priceCents: number };
type CartCtx = {
  items: CartItem[];
  add: (i: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  ready: boolean;
};
const Ctx = createContext<CartCtx>({ items: [], add() {}, remove() {}, clear() {}, has: () => false, ready: false });
const KEY = "qolip.cart.v1";
const MAX = 20;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.slice(0, MAX));
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((i: CartItem) => setItems((l) => (l.some((x) => x.id === i.id) || l.length >= MAX ? l : [...l, i])), []);
  const remove = useCallback((id: string) => setItems((l) => l.filter((x) => x.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);

  return <Ctx.Provider value={{ items, add, remove, clear, has, ready }}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
