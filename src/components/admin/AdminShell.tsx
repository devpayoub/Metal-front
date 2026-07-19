"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  Wrench,
  Building2,
  Tag,
  Layers,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/projects", label: "Projets", icon: Building2 },
  { href: "/admin/categories", label: "Catégories", icon: Tag },
  { href: "/admin/materials", label: "Matériaux", icon: Layers },
  { href: "/admin/thanks", label: "Lettres de remerciement", icon: Mail },
  { href: "/admin/feedback", label: "Retours clients", icon: MessageSquare },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (item: (typeof nav)[number]) =>
    item.exact ? pathname === item.href : pathname?.startsWith(item.href);

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {nav.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
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
  );

  const footerButtons = (onClose?: () => void) => (
    <div className="px-3 py-4 border-t border-white/10 space-y-1">
      <Link
        href="/"
        onClick={onClose}
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
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ================= Desktop sidebar (lg+) ================= */}
      <aside className="hidden lg:flex w-64 bg-secondary text-white flex-col">
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
        <NavList />
        {footerButtons()}
      </aside>

      {/* ================= Mobile top bar (< lg) ================= */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-secondary text-white flex items-center justify-between px-4 py-3 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="MIS"
            className="h-8 w-auto object-contain bg-white/95 rounded p-1"
          />
          <span className="font-bold text-sm">Admin</span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ================= Mobile bottom-sheet drawer (< lg) ================= */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-secondary text-white rounded-t-2xl max-h-[80vh] flex flex-col shadow-2xl"
            >
              {/* Drag handle + close */}
              <div className="flex items-center justify-between pt-3 pb-2 px-4 border-b border-white/10">
                <div className="mx-auto h-1.5 w-12 bg-white/20 rounded-full" />
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fermer le menu"
                  className="absolute right-4 top-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-3 border-b border-white/10">
                <div className="text-sm text-white/70 truncate">
                  {user?.email}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col">
                <NavList onNavigate={() => setDrawerOpen(false)} />
                {footerButtons(() => setDrawerOpen(false))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= Main ================= */}
      <main className="flex-1 overflow-x-hidden pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
