"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Printer } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api, type Order, type PublicSettings } from "@/lib/api-client";

type ProfileRecord = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
};

/** Inject `<base href="/fc/">` so the pdf24 HTML's relative resources
 *  (background image, fonts referenced from the same folder) resolve.
 *  Also: blank the document title and force `@page { margin: 0 }` so the
 *  browser's print dialog doesn't add a URL/date header on top of the PDF. */
function injectPrintFixups(html: string): string {
  let out = html.replace(/<head[^>]*>/i, (m) => `${m}\n<base href="/fc/">`);
  out = out.replace(/<title>[^<]*<\/title>/i, "<title> </title>");
  // Append a stylesheet *inside* head that wins over the template's rules.
  out = out.replace(
    /<\/head>/i,
    `<style>
@page { size: A4; margin: 0; }
@media print {
  html, body { margin: 0 !important; padding: 0 !important; }
}
</style>
</head>`
  );
  return out;
}

function fmt3(n: number): string {
  // Tunisian invoice format: "5 960.000" — thousand-separator + 3 decimals.
  const [intPart, decPart] = Number(n).toFixed(3).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped}.${decPart}`;
}

function buildInvoiceHtml(template: string, order: Order, profile: ProfileRecord | null) {
  const customerName = (order.customer_name || profile?.full_name || "").trim();
  const customerAddress = (order.customer_address || profile?.address || "").trim();
  const customerPhone = (order.customer_phone || profile?.phone || "").trim();

  const year = new Date(order.created_at).getFullYear();
  const invoiceNum = `${order.id.slice(0, 6).toUpperCase()}-${year}`;
  const date = new Date(order.created_at).toLocaleDateString("fr-FR");

  const items = order.items;
  // Aggregate every order line into a single template row.
  const designation =
    items.length === 0
      ? "—"
      : items.length === 1
      ? items[0].name
      : items.map((it) => `${it.name} ×${it.qty}`).join(" + ");
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const avgUnit =
    totalQty > 0 ? items.reduce((s, i) => s + i.price * i.qty, 0) / totalQty : 0;

  const TVA_RATE = 19;
  const totalTTC = Number(order.total);            // contains everything in our model
  const subtotalTTC = Number(order.subtotal);
  // Reverse-engineer the original template's amounts so each placeholder
  // ends up with a value that matches the template structure.
  const subtotalHT = subtotalTTC / (1 + TVA_RATE / 100);      // base HT
  const tvaAmount = subtotalTTC - subtotalHT;                 // VAT amount
  const fodec = subtotalHT / 100;                             // 1 % FODEC
  const baseAfterFodec = subtotalHT + fodec;                  // FODEC-adjusted HT
  const lineTotalTTC = baseAfterFodec + (baseAfterFodec * TVA_RATE) / 100;
  const timbre = 1;
  const netAPayer = totalTTC + timbre;

  const replacements: Array<[string | RegExp, string]> = [
    // ---- Header (client info on the top) ----
    ["Client : 601", `Client : ${order.id.slice(0, 4).toUpperCase()}`],
    ["Ste tunisien agricole chebbi", customerName || "—"],
    ["Adresse : Béja", `Adresse : ${customerAddress || "—"}`],
    ["Ident.Fisc : 1479829B/B/M", customerPhone ? `Tél : ${customerPhone}` : ""],

    // ---- Invoice number + date ----
    ["Facture N° 000008-2026", `Facture N° ${invoiceNum}`],
    ["Date 15/01/2026", `Date ${date}`],

    // ---- Single item row (concatenated designation) ----
    ["Tole nerveré prelaqué 6/10", designation],
    [">40 &nbsp;<", `>${totalQty} &nbsp;<`],          // Qty column (uniquely matches this span)
    [">149.000 &nbsp;<", `>${fmt3(avgUnit)} &nbsp;<`], // Prix Unit

    // ---- Amounts (template values appear in several places; replaceAll keeps them consistent) ----
    [/5 960\.000/g, fmt3(subtotalHT).replace(/ /g, " ")],
    [/5 960\.000/g, fmt3(subtotalHT)],
    [/59\.600/g, fmt3(fodec)],
    [/6 019\.600/g, fmt3(baseAfterFodec).replace(/ /g, " ")],
    [/6 019\.600/g, fmt3(baseAfterFodec)],
    [/1 143\.724/g, fmt3(tvaAmount).replace(/ /g, " ")],
    [/1 143\.724/g, fmt3(tvaAmount)],
    [/7 163\.324/g, fmt3(lineTotalTTC).replace(/ /g, " ")],
    [/7 163\.324/g, fmt3(lineTotalTTC)],
    [">1.000 &nbsp;<", `>${fmt3(timbre)} &nbsp;<`],
    [/7 164\.324/g, fmt3(netAPayer).replace(/ /g, " ")],
    [/7 164\.324/g, fmt3(netAPayer)],

    // Amount in words — replaced with numeric net for now (no number-to-words FR helper)
    [
      "SEPT MILLE CENT SOIXANTE-QUATRE DINARS ET TROIS CENT VINGT-QUATRE MILLIMES",
      `${fmt3(netAPayer)} DT`,
    ],

    // Footer cashier name → leave as-is.
  ];

  let out = template;
  for (const [search, repl] of replacements) {
    if (typeof search === "string") {
      out = out.split(search).join(repl);
    } else {
      out = out.replace(search, repl);
    }
  }
  return injectPrintFixups(out);
}

export function InvoicePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user, loading: authLoading, isAdmin, rolesLoaded } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [, setSettings] = useState<PublicSettings>({});
  const [template, setTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError("Veuillez vous connecter pour voir cette facture.");
      setLoading(false);
      return;
    }
    if (!rolesLoaded) return;
    if (!id) return;

    (async () => {
      try {
        const orderP = isAdmin
          ? api
              .get<{ order: Order }>(`/api/orders/${id}`, true)
              .then((d) => d.order)
              .catch(() => null)
          : api
              .get<{ items: Order[] }>("/api/orders/mine", true)
              .then((d) => d.items.find((o) => o.id === id) ?? null);

        const [foundOrder, profileRes, settingsRes, tpl] = await Promise.all([
          orderP,
          api.get<{ profile: ProfileRecord | null }>("/api/profile", true),
          api.get<{ settings: PublicSettings }>("/api/settings/public"),
          fetch("/fc/Facture.html").then((r) => r.text()),
        ]);

        if (!foundOrder) {
          setError("Facture introuvable.");
        } else {
          setOrder(foundOrder);
        }
        setProfile(profileRes.profile);
        setSettings(settingsRes.settings || {});
        setTemplate(tpl);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user, authLoading, isAdmin, rolesLoaded]);

  const html = order && template ? buildInvoiceHtml(template, order, profile) : "";

  // Auto-trigger print once the iframe has rendered the doc.
  useEffect(() => {
    if (!html) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      try {
        setTimeout(() => iframe.contentWindow?.print(), 250);
      } catch {
        // ignore
      }
    };
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [html]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (error || !order || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        {error || "Facture introuvable"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <div className="max-w-5xl mx-auto p-4 print:p-0">
        <div className="flex justify-end gap-2 mb-3 print:hidden">
          <button
            onClick={() => iframeRef.current?.contentWindow?.print()}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:brightness-110"
          >
            <Printer size={16} /> Imprimer / Enregistrer en PDF
          </button>
        </div>

        <iframe
          ref={iframeRef}
          title="Facture"
          srcDoc={html}
          className="w-full bg-white shadow rounded-lg"
          style={{ height: "calc(100vh - 80px)", border: 0 }}
        />
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}
