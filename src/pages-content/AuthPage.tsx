"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { api } from "@/lib/api-client";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(6, "Au moins 6 caractères").max(72),
});
const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Nom trop court").max(100),
});

export function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isAdmin, rolesLoaded, signIn } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") ?? undefined;

  useEffect(() => {
    if (!user || !rolesLoaded) return;
    if (redirect) router.push(redirect);
    else if (isAdmin) router.push("/admin");
    else router.push("/client");
  }, [user, isAdmin, rolesLoaded, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ email, password, fullName });
        if (!parsed.success) throw new Error(parsed.error.issues[0].message);
        
        await api.post("/api/auth/register", {
          email: parsed.data.email,
          password: parsed.data.password,
          full_name: parsed.data.fullName,
        });
        
        toast.success("Compte créé. Veuillez vous connecter.");
        setMode("signin");
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) throw new Error(parsed.error.issues[0].message);
        
        const data = await api.post<{ access_token: string; user: AuthUser }>("/api/auth/login", {
          email: parsed.data.email,
          password: parsed.data.password,
        });
        
        signIn({ user: data.user, access_token: data.access_token });
        toast.success("Bon retour !");
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-secondary via-[#0d1117] to-secondary flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_30px_80px_-20px_rgba(255,107,0,0.25)]"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              {mode === "signin" ? <LogIn className="text-white" size={28} /> : <UserPlus className="text-white" size={28} />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {mode === "signin" ? "Bon retour" : "Créer un compte"}
            </h1>
            <p className="text-white/60 text-sm">
              {mode === "signin" ? "Connectez-vous à votre espace client" : "Rejoignez le portail MIS Metal"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Field icon={<UserIcon size={16} />} label="Nom complet">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="bg-transparent w-full outline-none text-white placeholder-white/30"
                  required
                />
              </Field>
            )}
            <Field icon={<Mail size={16} />} label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@entreprise.com"
                className="bg-transparent w-full outline-none text-white placeholder-white/30"
                required
              />
            </Field>
            <Field icon={<Lock size={16} />} label="Mot de passe">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-white placeholder-white/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="text-white/40 hover:text-white/70 shrink-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "signin" ? "Se connecter" : "Créer un compte"}
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-6">
            {mode === "signin" ? "Pas de compte ?" : "Déjà membre ?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:underline font-medium"
            >
              {mode === "signin" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
          <p className="text-center mt-4">
            <Link href="/" className="text-white/40 text-xs hover:text-white/70">← Retour au site</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">{label}</span>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-primary rounded-lg px-3 py-2.5 transition">
        <span className="text-white/40">{icon}</span>
        {children}
      </div>
    </label>
  );
}