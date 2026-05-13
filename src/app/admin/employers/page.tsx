"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import type { Employer } from "@/lib/api-client";

const columns: Column<Employer>[] = [
  {
    key: "photo_url",
    label: "",
    width: "70px",
    render: (r) =>
      r.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.photo_url} alt={r.full_name} className="w-12 h-12 object-cover rounded-full" />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded-full" />
      ),
  },
  { key: "full_name", label: "Nom" },
  { key: "role", label: "Fonction" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Téléphone" },
];

const fields: Field[] = [
  { name: "full_name", label: "Nom complet", required: true },
  { name: "role", label: "Fonction / Titre" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Téléphone" },
  { name: "photo_url", label: "Photo", type: "image", uploadEndpoint: "/api/employers/upload" },
  { name: "bio", label: "Biographie", type: "textarea" },
];

export default function AdminEmployersPage() {
  return (
    <CrudTable<Employer>
      title="Équipe"
      resource="employers"
      listKey="items"
      itemKey="employer"
      columns={columns}
      fields={fields}
    />
  );
}
