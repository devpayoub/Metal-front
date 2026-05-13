"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { CursorGlow } from "@/components/fx/CursorGlow";
import { PageTransition } from "@/components/fx/PageTransition";
import { Toaster } from "@/components/ui/sonner";
import { FloatingActions } from "@/components/site/FloatingActions";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const chromeless = pathname === "/auth" || pathname?.startsWith("/admin") || false;
  const skipTransition = pathname?.startsWith("/admin") ?? false;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <ScrollProgress />
            <CursorGlow />
            {!chromeless && <Navbar />}
            <main className="flex-1">
              {skipTransition ? children : <PageTransition>{children}</PageTransition>}
            </main>
            {!chromeless && <Footer />}
            {!chromeless && <FloatingActions />}
          </div>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
