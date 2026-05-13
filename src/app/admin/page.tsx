"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Building2, Users, Megaphone, ArrowRight } from "lucide-react";
import { api } from "@/lib/api-client";

type Stats = { products: number; projects: number; employers: number; announcements: number };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, projects: 0, employers: 0, announcements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, pr, e, a] = await Promise.all([
          api.get<{ items: unknown[]; total: number | null }>("/api/products"),
          api.get<{ items: unknown[] }>("/api/projects"),
          api.get<{ items: unknown[] }>("/api/employers"),
          api.get<{ items: unknown[] }>("/api/announcements"),
        ]);
        setStats({
          products: (p.total ?? p.items.length) || 0,
          projects: pr.items.length,
          employers: e.items.length,
          announcements: a.items.length,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { key: "products", label: "Produits", value: stats.products, icon: Package, href: "/admin/products", color: "bg-orange-100 text-primary" },
    { key: "projects", label: "Projets", value: stats.projects, icon: Building2, href: "/admin/projects", color: "bg-blue-100 text-blue-600" },
    { key: "employers", label: "Équipe", value: stats.employers, icon: Users, href: "/admin/employers", color: "bg-green-100 text-green-600" },
    { key: "announcements", label: "Annonces", value: stats.announcements, icon: Megaphone, href: "/admin/announcements", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-secondary mb-1">Tableau de bord</h1>
      <p className="text-sm text-gray-500 mb-8">Aperçu de vos données</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.key}
              href={c.href}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                  <Icon size={20} />
                </div>
                <ArrowRight className="text-gray-300 group-hover:text-primary transition-colors" size={18} />
              </div>
              <div className="text-3xl font-bold text-secondary">{loading ? "…" : c.value}</div>
              <div className="text-sm text-gray-500 mt-1">{c.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
