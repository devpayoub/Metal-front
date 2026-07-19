"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import type { Feedback } from "@/lib/api-client";

const columns: Column<Feedback>[] = [
  { key: "name", label: "Nom" },
  {
    key: "company",
    label: "Société",
    render: (r) => <span className="text-gray-500">{r.company || "—"}</span>,
  },
  {
    key: "description",
    label: "Description",
    render: (r) => (
      <span className="text-gray-600 line-clamp-2 max-w-md">{r.description}</span>
    ),
  },
  {
    key: "email",
    label: "Email",
    render: (r) => <span className="text-gray-500 text-xs">{r.email}</span>,
  },
  {
    key: "email_verified",
    label: "Vérifié",
    render: (r) => (r.email_verified ? "✓" : "—"),
  },
  {
    key: "published",
    label: "Publié",
    render: (r) =>
      r.published ? (
        <span className="text-green-600 font-medium">✓</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "created_at",
    label: "Date",
    render: (r) => (
      <span className="text-gray-400 text-xs whitespace-nowrap">
        {new Date(r.created_at).toLocaleDateString("fr-FR")}
      </span>
    ),
  },
];

// Only `published` is editable from admin (visibility toggle).
// Other fields are carried in form state via `hidden` so they appear in the
// Edit modal's read-only context (if needed) but are never sent to the
// backend — the PUT endpoint whitelists `published` only.
const fields: Field[] = [
  { name: "name", label: "Nom", hidden: true },
  { name: "company", label: "Société", hidden: true },
  { name: "description", label: "Description", hidden: true },
  { name: "email", label: "Email", hidden: true },
  { name: "published", label: "Publié", type: "boolean" },
];

export default function AdminFeedbackPage() {
  return (
    <CrudTable<Feedback>
      title="Retours clients"
      resource="feedback"
      listPath="/api/feedback"
      listKey="items"
      itemKey="feedback"
      columns={columns}
      fields={fields}
    />
  );
}
