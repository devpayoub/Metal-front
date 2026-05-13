"use client";

import { supabase } from "@/integrations/supabase/client";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Json = Record<string, unknown>;

async function request<T = unknown>(
  path: string,
  opts: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string>) };
  if (opts.body && !(opts.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (opts.auth) Object.assign(headers, await authHeader());

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { ...opts, headers });
  const json = await res.json().catch(() => ({ success: false, error: res.statusText }));
  if (!res.ok || json.success === false) {
    throw new Error(json.error || `Request failed: ${res.status}`);
  }
  return json.data as T;
}

export const api = {
  get: <T = unknown>(path: string, auth = false) =>
    request<T>(path, { method: "GET", auth }),
  post: <T = unknown>(path: string, body?: Json | FormData, auth = false) =>
    request<T>(path, {
      method: "POST",
      auth,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),
  put: <T = unknown>(path: string, body: Json, auth = true) =>
    request<T>(path, { method: "PUT", auth, body: JSON.stringify(body) }),
  delete: <T = unknown>(path: string, auth = true) =>
    request<T>(path, { method: "DELETE", auth }),
};

export type Product = {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  unite: string | null;
  tva: number;
  prix_gros_ht: number;
  prix_gros_ttc: number;
  prix_achat_ttc: number;
  remise: number;
  etat: "Actif" | "Inactif";
  fournisseur: string | null;
  code_fournisseur: string | null;
  famille: string | null;
  marge_gros: number;
  magasin: string | null;
  promotion: boolean;
  created_at: string;
};
export type Project = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  images: unknown;
  cover_url: string | null;
  year: number | null;
  created_at: string;
};
export type Employer = {
  id: string;
  full_name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  bio: string | null;
};
export type Announcement = {
  id: string;
  title: string;
  body: string | null;
  type: "job" | "promotion" | "news" | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
};
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};
export type Service = {
  id: string;
  title: string;
  short_desc: string | null;
  long_desc: string | null;
  icon: string | null;
  image_url: string | null;
  features: string[];
  position: number;
  published: boolean;
  created_at: string;
};
export type OrderItem = {
  product_id: string;
  name: string;
  category: string | null;
  price: number;
  qty: number;
  line_total: number;
};
export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};
export type Supplier = {
  id: string;
  code: number;
  nom_raison_sociale: string;
  telephone: string | null;
  adresse: string | null;
  region: string | null;
  responsable: string | null;
  identifiant_fiscal: string | null;
  solde: number;
  exo: boolean;
  tim: boolean;
  fod: boolean;
  bloc: boolean;
  categorie: string | null;
  compte_commercial: string | null;
  compte_comptable: string | null;
  delai_paiement: string | null;
  created_at: string;
};
export type PublicSettings = {
  whatsapp_number?: string;
  delivery_fee?: number;
  currency?: string;
  company_name?: string;
};
