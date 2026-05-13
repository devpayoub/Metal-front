"use client";

import { CrudTable, type Column, type Field } from "@/components/admin/CrudTable";
import { type Supplier } from "@/lib/api-client";

const columns: Column<Supplier>[] = [
  { key: "code", label: "Code", width: "70px" },
  { key: "nom_raison_sociale", label: "Raison sociale" },
  { key: "telephone", label: "Téléphone", width: "130px" },
  { key: "region", label: "Région", width: "110px" },
  { key: "categorie", label: "Catégorie", width: "130px" },
  {
    key: "solde",
    label: "Solde",
    width: "110px",
    render: (r) => `${Number(r.solde).toFixed(3)} DT`,
  },
  {
    key: "bloc",
    label: "État",
    width: "90px",
    render: (r) => (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.bloc ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}
      >
        {r.bloc ? "Bloqué" : "Actif"}
      </span>
    ),
  },
];

const fields: Field[] = [
  { name: "code", label: "Code", type: "number", group: "Identité" },
  { name: "nom_raison_sociale", label: "Raison sociale", required: true, group: "Identité" },
  { name: "responsable", label: "Responsable", group: "Identité" },
  { name: "identifiant_fiscal", label: "Identifiant fiscal", group: "Identité" },
  { name: "categorie", label: "Catégorie", group: "Identité" },

  { name: "telephone", label: "Téléphone", group: "Coordonnées" },
  { name: "adresse", label: "Adresse", type: "textarea", group: "Coordonnées" },
  { name: "region", label: "Région", group: "Coordonnées" },

  { name: "solde", label: "Solde", type: "number", group: "Comptabilité" },
  { name: "compte_commercial", label: "Compte commercial", group: "Comptabilité" },
  { name: "compte_comptable", label: "Compte comptable", group: "Comptabilité" },
  { name: "delai_paiement", label: "Délai de paiement", group: "Comptabilité" },

  { name: "exo", label: "Exonéré (EXO)", type: "boolean", group: "Indicateurs" },
  { name: "tim", label: "Timbre (TIM)", type: "boolean", group: "Indicateurs" },
  { name: "fod", label: "FODEC (FOD)", type: "boolean", group: "Indicateurs" },
  { name: "bloc", label: "Bloqué (BLOC)", type: "boolean", group: "Indicateurs" },
];

const initialValues: Partial<Supplier> = {
  solde: 0,
  exo: false,
  tim: true,
  fod: true,
  bloc: false,
};

export default function AdminSuppliersPage() {
  return (
    <CrudTable<Supplier>
      title="Fournisseurs"
      resource="suppliers"
      listKey="items"
      itemKey="supplier"
      columns={columns}
      fields={fields}
      initialValues={initialValues}
    />
  );
}
