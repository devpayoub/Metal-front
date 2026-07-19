"use client";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function authHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token");
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

  /** Upload a single image. Backend returns `{ data: { url } }`. */
  upload: async (path: string, file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const data = await request<{ url: string }>(path, { method: "POST", auth: true, body: fd });
    return data.url;
  },

  /** Upload multiple images. Backend returns `{ data: { uploaded: [{ url }] } }`. */
  uploadMany: async (path: string, files: File[]): Promise<string[]> => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    const data = await request<{ uploaded: { url: string }[] }>(path, {
      method: "POST",
      auth: true,
      body: fd,
    });
    return data.uploaded.map((u) => u.url);
  },

  /** Fetch raw text (e.g. the static invoice HTML template). */
  download: async (path: string): Promise<string> => {
    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const res = await fetch(url, { headers: await authHeader() });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.text();
  },
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  images: unknown;
  cover_url: string | null;
  year: number | null;
  category: string | null;
  video_url?: string | null;
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
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};
export type Material = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  position: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};
export type ThanksLetter = {
  id: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  author: string | null;
  image_url: string | null;
  position: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};
export type PublicSettings = {
  whatsapp_number?: string;
  delivery_fee?: number;
  currency?: string;
  company_name?: string;
  thanks_title?: string;
  thanks_subtitle?: string;
  thanks_body?: string;
  thanks_author?: string;
  thanks_image?: string;
};
export type OrderItem = {
  name: string;
  qty: number;
  line_total: number;
  price: number;
};
export type Order = {
  id: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  subtotal?: number;
  items: OrderItem[];
  customer_name?: string | null;
  customer_address?: string | null;
  customer_phone?: string | null;
  created_at: string;
};

// Client feedback — must be email-verified before it surfaces.
export type FeedbackRequest = {
  name: string;
  company?: string;
  description: string;
  email: string;
};
export type Feedback = {
  id: string;
  name: string;
  company: string | null;
  description: string;
  email: string;
  email_verified: boolean;
  published: boolean;
  created_at: string;
};

