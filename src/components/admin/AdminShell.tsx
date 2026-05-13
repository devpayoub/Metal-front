"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Wrench,
  Building2,
  Users,
  Megaphone,
  ShoppingBag,
  Settings,
  LogOut,
  Home,
  Truck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/suppliers", label: "Fournisseurs", icon: Truck },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/projects", label: "Projets", icon: Building2 },
  { href: "/admin/employers", label: "Équipe", icon: Users },
  { href: "/admin/announcements", label: "Annonces", icon: Megaphone },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-secondary text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="MIS"
              className="h-10 w-auto object-contain bg-white/95 rounded p-1 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-bold">Admin</div>
              <div className="text-xs text-white/60 truncate">{user?.email}</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white rounded-lg"
          >
            <Home size={18} /> Voir le site
          </Link>
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white rounded-lg"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
