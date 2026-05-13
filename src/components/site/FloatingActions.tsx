"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Plus, MessageSquarePlus, X, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { api } from "@/lib/api-client";
import {
  requestFeedback,
  verifyFeedback,
  resendFeedbackCode,
} from "@/hooks/useFeedback";

type Step = "form" | "email" | "code" | "done";

export function FloatingActions() {
  const [open, setOpen] = useState(false); // FAB expanded?
  const [dialogOpen, setDialogOpen] = useState(false); // feedback modal?
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  // Pull the whatsapp number from public settings once per session.
  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<{ settings?: { whatsapp_number?: string } }>(
          "/api/settings"
        );
        const num = data?.settings?.whatsapp_number?.trim();
        if (num) setWhatsapp(num.replace(/[^\d]/g, ""));
      } catch {
        // Silently fall back to plain wa.me link.
      }
    })();
  }, []);

  // Reset dialog state each time it closes.
  useEffect(() => {
    if (!dialogOpen) {
      const t = setTimeout(() => {
        setStep("form");
        setForm({ name: "", company: "", description: "" });
        setEmail("");
        setCode("");
        setFeedbackId(null);
        setError(null);
        setBusy(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [dialogOpen]);

  // ---- Dialog state ----
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", company: "", description: "" });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Step transitions ----
  async function submitForm() {
    setError(null);
    if (!form.name.trim()) return setError("Veuillez indiquer votre nom");
    if (form.description.trim().length < 10)
      return setError("La description doit faire au moins 10 caractères");
    setStep("email");
  }

  async function submitEmail() {
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Adresse email invalide");
    setBusy(true);
    try {
      const res = await requestFeedback({
        name: form.name.trim(),
        company: form.company.trim() || undefined,
        description: form.description.trim(),
        email: email.trim(),
      });
      setFeedbackId(res.feedback_id);
      setStep("code");
      toast.success("Code envoyé ! Vérifiez votre boîte mail.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setBusy(false);
    }
  }

  async function submitCode() {
    setError(null);
    if (code.length !== 6) return setError("Entrez les 6 chiffres");
    if (!feedbackId) return setError("Session invalide, recommencez");
    setBusy(true);
    try {
      await verifyFeedback(feedbackId, code);
      setStep("done");
      toast.success("Merci ! Votre retour a été publié.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Code invalide");
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setError(null);
    if (!feedbackId) return;
    setBusy(true);
    try {
      await resendFeedbackCode(feedbackId);
      toast.success("Nouveau code envoyé.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec du renvoi");
    } finally {
      setBusy(false);
    }
  }

  // WhatsApp link — falls back to the WhatsApp launcher if no number set.
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        "Bonjour MIS Metal Construction, je souhaite vous contacter."
      )}`
    : "https://wa.me/";

  return (
    <>
      {/* ========================= FAB cluster ========================= */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <>
              {/* Feedback */}
              <motion.button
                key="fb"
                onClick={() => {
                  setOpen(false);
                  setDialogOpen(true);
                }}
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                transition={{ delay: 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-secondary text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl"
                aria-label="Laisser un retour"
              >
                <MessageSquarePlus size={20} />
                <span className="text-sm font-medium">Votre avis</span>
              </motion.button>

              {/* WhatsApp */}
              <motion.a
                key="wa"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl"
                aria-label="Discuter sur WhatsApp"
              >
                <MessageCircle size={20} />
                <span className="text-sm font-medium">WhatsApp</span>
              </motion.a>
            </>
          )}
        </AnimatePresence>

        {/* Main toggle */}
        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{ rotate: open ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/40"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <Plus size={26} />
        </motion.button>
      </div>

      {/* ========================= Feedback dialog ========================= */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-secondary">
              Votre retour nous intéresse
            </DialogTitle>
            <DialogDescription>
              Partagez votre expérience avec MIS Metal Construction. Nous
              vérifierons votre email avant publication.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <AnimatePresence mode="wait">
            {/* ---------- Step 1: form ---------- */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="fb-name">Nom *</Label>
                  <Input
                    id="fb-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fb-company">Entreprise (optionnel)</Label>
                  <Input
                    id="fb-company"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fb-desc">Votre retour *</Label>
                  <Textarea
                    id="fb-desc"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Décrivez votre expérience (min. 10 caractères)"
                    rows={4}
                  />
                </div>
                <Button className="w-full" onClick={submitForm}>
                  Continuer
                </Button>
              </motion.div>
            )}

            {/* ---------- Step 2: email ---------- */}
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-gray-600">
                  Nous allons envoyer un code de vérification à 6 chiffres à
                  votre adresse email. Vérifiez qu'elle est correcte.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="fb-email">Email *</Label>
                  <Input
                    id="fb-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("form")}
                  >
                    Retour
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={submitEmail}
                    disabled={busy}
                  >
                    {busy ? "Envoi..." : "Recevoir le code"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ---------- Step 3: code ---------- */}
            {step === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-gray-600">
                  Entrez le code à 6 chiffres envoyé à{" "}
                  <strong className="text-secondary">{email}</strong>. Expire
                  dans 10 minutes.
                </p>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  className="w-full"
                  onClick={submitCode}
                  disabled={busy || code.length !== 6}
                >
                  {busy ? "Vérification..." : "Vérifier"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={busy}
                    className="text-xs text-primary hover:underline underline-offset-4 disabled:opacity-50"
                  >
                    Renvoyer le code
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------- Step 4: done ---------- */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-4 py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <Check className="text-green-600" size={36} />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-secondary">
                    Merci pour votre retour !
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Votre retour a été vérifié et publié.
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setDialogOpen(false)}
                >
                  Fermer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
