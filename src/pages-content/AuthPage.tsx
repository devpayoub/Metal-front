"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isAdmin, rolesLoaded } = useAuth();
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
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/client`,
            data: { full_name: parsed.data.fullName },
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Vérifiez votre email pour confirmer.");
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) throw new Error(parsed.error.issues[0].message);
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Bon retour !");
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/client` },
    });
    if (error) toast.error(error.message);
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

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium px-4 py-3 rounded-lg hover:bg-white/90 transition mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/40 text-xs uppercase tracking-wider">ou</span>
            <div className="h-px flex-1 bg-white/10" />
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-white placeholder-white/30"
                required
              />
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