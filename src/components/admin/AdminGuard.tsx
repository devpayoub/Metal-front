"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isAdmin, rolesLoaded } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth?redirect=/admin");
      return;
    }
    // Wait for the role lookup before deciding — otherwise admins get
    // bounced to "/" on every reload because isAdmin starts false.
    if (rolesLoaded && !isAdmin) router.push("/");
  }, [user, isAdmin, rolesLoaded, loading, router]);

  if (loading || !user || !rolesLoaded || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-white/60">Vérification des permissions…</div>
      </div>
    );
  }
  return <>{children}</>;
}
