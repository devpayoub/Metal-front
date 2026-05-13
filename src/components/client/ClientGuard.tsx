"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function ClientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isAdmin, rolesLoaded } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth?redirect=/client");
      return;
    }
    if (rolesLoaded && isAdmin) {
      router.push("/admin");
    }
  }, [user, isAdmin, loading, rolesLoaded, router]);

  if (loading || !user || !rolesLoaded || isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-white/60">Chargement…</div>
      </div>
    );
  }
  return <>{children}</>;
}
