"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wrench, Building2, Mail, Settings, ArrowRight } from "lucide-react";
import { api } from "@/lib/api-client";

type Stats = { services: number; projects: number; thanks: number; materials: number };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ services: 0, projects: 0, thanks: 0, materials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [services, projects, thanks, materials] = await Promise.all([
          api.get<{ items: unknown[] }>("/api/services").catch(() => ({ items: [] })),
          api.get<{ items: unknown[] }>("/api/projects").catch(() => ({ items: [] })),
          api.get<{ items: unknown[] }>("/api/thanks/all", true).catch(() => ({ items: [] })),
          api.get<{ items: unknown[] }>("/api/materials").catch(() => ({ items: [] })),
        ]);
        setStats({
          services: services.items.length,
          projects: projects.items.length,
          thanks: thanks.items.length,
          materials: materials.items.length,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { key: "services", label: "Services", value: stats.services, icon: Wrench, href: "/admin/services", color: "bg-orange-100 text-orange-600" },
    { key: "projects", label: "Projets", value: stats.projects, icon: Building2, href: "/admin/projects", color: "bg-blue-100 text-blue-600" },
    { key: "thanks", label: "Lettres de remerciement", value: stats.thanks, icon: Mail, href: "/admin/thanks", color: "bg-green-100 text-green-600" },
    { key: "settings", label: "Paramètres", value: null, icon: Settings, href: "/admin/settings", color: "bg-purple-100 text-purple-600" },
    { key: "materials", label: "Matériaux", value: stats.materials, icon: Building2, href: "/admin/materials", color: "bg-cyan-100 text-cyan-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-secondary mb-1">Tableau de bord</h1>
      <p className="text-sm text-gray-500 mb-6 sm:mb-8">Aperçu de vos données</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.key}
              href={c.href}
              className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                  <Icon size={20} />
                </div>
                <ArrowRight className="text-gray-300 group-hover:text-primary transition-colors" size={18} />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-secondary">
                {c.value === null ? "—" : loading ? "…" : c.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{c.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
