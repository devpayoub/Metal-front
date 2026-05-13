"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User as UserIcon,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export type ClientSection = "dashboard" | "profile" | "orders";

type Item = {
  key: ClientSection;
  label: string;
  icon: typeof LayoutDashboard;
};

const nav: Item[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "profile", label: "Mon profil", icon: UserIcon },
  { key: "orders", label: "Mes commandes", icon: ShoppingBag },
];

export function ClientShell({
  section,
  onSectionChange,
  displayName,
  avatarUrl,
  email,
  children,
}: {
  section: ClientSection;
  onSectionChange: (s: ClientSection) => void;
  displayName: string;
  avatarUrl?: string | null;
  email?: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="lg:sticky lg:top-24 self-start space-y-4">
            <div className="bg-white rounded-lg shadow p-5 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="MIS Metal Construction"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-secondary/10 overflow-hidden flex items-center justify-center shrink-0">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={22} className="text-secondary/60" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-secondary truncate">
                    {displayName}
                  </div>
                  {email && (
                    <div className="text-xs text-gray-500 truncate">{email}</div>
                  )}
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-lg shadow p-2">
              <ul className="space-y-1">
                {nav.map((item) => {
                  const Icon = item.icon;
                  const active = section === item.key;
                  return (
                    <li key={item.key}>
                      <button
                        onClick={() => onSectionChange(item.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors ${
                          active
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={18} /> {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="my-2 border-t border-gray-200" />
              <button
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={18} /> Sign out
              </button>
            </nav>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
