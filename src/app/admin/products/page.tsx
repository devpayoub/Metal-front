"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import { api, type Product, type Category, type Supplier } from "@/lib/api-client";

const fmt = (v: number | null | undefined) =>
  v == null ? "—" : Number(v).toFixed(3);

// Cache suppliers in this module so the select dropdown and the
// auto-fill on selection share a single fetch.
let _suppliersCache: Supplier[] | null = null;
async function getSuppliers(): Promise<Supplier[]> {
  if (_suppliersCache) return _suppliersCache;
  const d = await api.get<{ items: Supplier[] }>("/api/suppliers", true);
  _suppliersCache = d.items;
  return _suppliersCache;
}

const columns: Column<Product>[] = [
  {
    key: "image_url",
    label: "",
    width: "60px",
    render: (r) =>
      r.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.image_url} alt={r.name} className="w-10 h-10 object-cover rounded" />
      ) : (
        <div className="w-10 h-10 bg-gray-100 rounded" />
      ),
  },
  { key: "code", label: "Code", width: "100px" },
  { key: "name", label: "Désignation" },
  { key: "unite", label: "Unité", width: "70px" },
  { key: "stock", label: "Stock", width: "70px" },
  {
    key: "price",
    label: "Prix vente TTC",
    render: (r) => `${fmt(r.price)} DT`,
  },
  { key: "tva", label: "TVA", width: "60px", render: (r) => `${r.tva}%` },
  {
    key: "etat",
    label: "État",
    width: "90px",
    render: (r) => (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.etat === "Actif" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
        }`}
      >
        {r.etat}
      </span>
    ),
  },
  {
    key: "promotion",
    label: "Promo",
    width: "70px",
    render: (r) => (r.promotion ? "✓" : "—"),
  },
];

const fields: Field[] = [
  { name: "code", label: "Code", group: "Identité" },
  { name: "name", label: "Désignation", required: true, group: "Identité" },
  { name: "description", label: "Description", type: "textarea", group: "Identité" },
  {
    name: "category",
    label: "Catégorie",
    type: "select",
    group: "Identité",
    loadOptions: async () => {
      const d = await api.get<{ items: Category[] }>("/api/categories");
      return d.items.map((c) => c.name);
    },
  },
  { name: "famille", label: "Famille", group: "Identité" },
  {
    name: "etat",
    label: "État",
    type: "select",
    options: ["Actif", "Inactif"],
    group: "Identité",
  },

  {
    name: "unite",
    label: "Unité",
    type: "select",
    options: ["U", "M", "M2", "M3", "KG", "ML", "BOITE", "PAQUET"],
    group: "Stock & Tarif",
  },
  { name: "stock", label: "Stock", type: "number", group: "Stock & Tarif" },
  { name: "price", label: "Prix vente TTC", type: "number", required: true, group: "Stock & Tarif" },
  { name: "tva", label: "TVA (%)", type: "number", group: "Stock & Tarif" },
  { name: "remise", label: "Remise (%)", type: "number", group: "Stock & Tarif" },
  { name: "promotion", label: "Promotion", type: "boolean", group: "Stock & Tarif" },

  { name: "prix_gros_ht", label: "Prix gros HT", type: "number", group: "Tarifs internes" },
  { name: "prix_gros_ttc", label: "Prix gros TTC", type: "number", group: "Tarifs internes" },
  { name: "prix_achat_ttc", label: "Prix achat TTC", type: "number", group: "Tarifs internes" },
  { name: "marge_gros", label: "Marge gros", type: "number", group: "Tarifs internes" },

  {
    name: "fournisseur",
    label: "Fournisseur",
    type: "select",
    group: "Fournisseur & Magasin",
    loadOptions: async () => {
      const items = await getSuppliers();
      return items.map((s) => s.nom_raison_sociale);
    },
    onSelect: async (value) => {
      const items = await getSuppliers();
      const s = items.find((x) => x.nom_raison_sociale === value);
      return { code_fournisseur: s ? String(s.code) : "" };
    },
  },
  {
    name: "code_fournisseur",
    label: "Code fournisseur",
    group: "Fournisseur & Magasin",
    hidden: true,
  },
  {
    name: "magasin",
    label: "Magasin",
    type: "select",
    group: "Fournisseur & Magasin",
    loadOptions: async () => {
      const d = await api.get<{ items: Product[] }>("/api/products", true);
      const set = new Set<string>();
      for (const p of d.items) {
        if (p.magasin && p.magasin.trim()) set.add(p.magasin.trim());
      }
      return Array.from(set).sort();
    },
  },

  { name: "image_url", label: "Image", type: "image", uploadEndpoint: "/api/products/upload", group: "Image" },
];

const initialValues: Partial<Product> = {
  etat: "Actif",
  promotion: false,
  tva: 19,
  remise: 0,
  stock: 0,
};

export default function AdminProductsPage() {
  return (
    <CrudTable<Product>
      title="Products"
      resource="products"
      listKey="items"
      itemKey="product"
      columns={columns}
      fields={fields}
      initialValues={initialValues}
    />
  );
}
