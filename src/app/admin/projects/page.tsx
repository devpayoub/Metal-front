"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import type { Project } from "@/lib/api-client";

const columns: Column<Project>[] = [
  {
    key: "cover_url",
    label: "",
    width: "70px",
    render: (r) =>
      r.cover_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.cover_url} alt={r.title} className="w-12 h-12 object-cover rounded" />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded" />
      ),
  },
  { key: "title", label: "Titre" },
  { key: "location", label: "Lieu" },
  { key: "year", label: "Année" },
];

const fields: Field[] = [
  { name: "title", label: "Titre", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "location", label: "Lieu" },
  { name: "year", label: "Année", type: "number" },
  { name: "cover_url", label: "Image de couverture", type: "image", uploadEndpoint: "/api/projects/upload" },
];

export default function AdminProjectsPage() {
  return (
    <CrudTable<Project>
      title="Projets"
      resource="projects"
      listKey="items"
      itemKey="project"
      columns={columns}
      fields={fields}
    />
  );
}
