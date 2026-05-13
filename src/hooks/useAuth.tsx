"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export type AuthUser = {
  id: string;
  email: string;
  metadata?: Record<string, any>;
  roles?: string[];
};

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  rolesLoaded: boolean;
  signIn: (data: { user: AuthUser; access_token: string }) => void;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  isAdmin: false,
  rolesLoaded: false,
  signIn: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        setRolesLoaded(true);
        return;
      }
      try {
        const data = await api.get<{ user: AuthUser }>("/api/auth/me", true);
        setUser(data.user);
        setIsAdmin(data.user.roles?.includes("admin") ?? false);
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
        setRolesLoaded(true);
      }
    };
    initAuth();
  }, []);

  const signIn = (data: { user: AuthUser; access_token: string }) => {
    localStorage.setItem("auth_token", data.access_token);
    setUser(data.user);
    setIsAdmin(data.user.roles?.includes("admin") ?? false);
    setRolesLoaded(true);
  };

  const signOut = async () => {
    try {
      await api.post("/api/auth/logout", {}, true);
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAdmin(false);
    router.push("/auth");
  };

  return (
    <Ctx.Provider value={{ user, loading, isAdmin, rolesLoaded, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
