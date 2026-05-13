"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  product_id: string;
  name: string;
  category: string | null;
  price: number;
  image: string | null;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (product_id: string, qty: number) => void;
  remove: (product_id: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const STORAGE_KEY = "mis-cart-v1";

const Ctx = createContext<CartCtx>({
  items: [],
  count: 0,
  subtotal: 0,
  add: () => {},
  setQty: () => {},
  remove: () => {},
  clear: () => {},
  hydrated: false,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const add: CartCtx["add"] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.product_id === item.product_id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const setQty: CartCtx["setQty"] = useCallback((product_id, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((p) => p.product_id !== product_id);
      return prev.map((p) => (p.product_id === product_id ? { ...p, qty } : p));
    });
  }, []);

  const remove: CartCtx["remove"] = useCallback((product_id) => {
    setItems((prev) => prev.filter((p) => p.product_id !== product_id));
  }, []);

  const clear: CartCtx["clear"] = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return { items, count, subtotal, add, setQty, remove, clear, hydrated };
  }, [items, add, setQty, remove, clear, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
