"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Loader2,
  User as UserIcon,
  Phone,
  MapPin,
  FileText,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { api, type PublicSettings } from "@/lib/api-client";

type ProfileRecord = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
};

export function CartPage() {
  const { items, subtotal, setQty, remove, clear, hydrated } = useCart();
  const { user } = useAuth();
  const [settings, setSettings] = useState<PublicSettings>({});
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<{ settings: PublicSettings }>("/api/settings/public")
      .then((d) => setSettings(d.settings))
      .catch(() => setSettings({}));
  }, []);

  useEffect(() => {
    if (!user) return;
    api
      .get<{ profile: ProfileRecord | null }>("/api/profile", true)
      .then((d) => {
        if (!d.profile) return;
        setForm((f) => ({
          customer_name:
            f.customer_name ||
            d.profile?.full_name ||
            (user.user_metadata?.full_name as string) ||
            "",
          customer_phone: f.customer_phone || d.profile?.phone || "",
          customer_address: f.customer_address || d.profile?.address || "",
          notes: f.notes,
        }));
      })
      .catch(() => {});
  }, [user]);

  const currency = settings.currency || "DT";
  const deliveryFee = Number(settings.delivery_fee) || 0;
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);

  const formatPrice = (v: number) => `${v.toFixed(2)} ${currency}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      toast.error("Le nom et le téléphone sont requis");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        customer_address: form.customer_address || undefined,
        notes: form.notes || undefined,
        items: items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
      };
      const data = await api.post<{ whatsapp_url: string | null }>("/api/orders", payload, true);
      if (data.whatsapp_url) {
        clear();
        toast.success("Commande passée ! Ouverture de WhatsApp…");
        window.open(data.whatsapp_url, "_blank");
      } else {
        toast.success("Commande passée !");
        clear();
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <section className="bg-secondary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,107,0,0.18),transparent_55%)]" />
        <div className="container mx-auto px-4 relative flex items-center gap-3">
          <ShoppingCart size={28} />
          <div>
            <h1 className="text-3xl font-bold">Votre panier</h1>
            <p className="text-gray-300 text-sm">
              {items.length} article(s) · {formatPrice(subtotal)}
            </p>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500 mb-6">Votre panier est vide.</p>
            <Link
              href="/shop"
              className="inline-flex bg-primary text-white px-6 py-3 rounded-lg hover:brightness-110"
            >
              Parcourir la boutique
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-full sm:w-28 h-28 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-secondary font-semibold line-clamp-2">{item.name}</h3>
                    {item.category && (
                      <div className="text-xs text-primary uppercase tracking-wider mt-1">
                        {item.category}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">{formatPrice(item.price)} each</div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQty(item.product_id, item.qty - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"
                          aria-label="Diminuer"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-medium">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.product_id, item.qty + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"
                          aria-label="Augmenter"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="font-bold text-primary text-lg">
                        {formatPrice(item.price * item.qty)}
                      </div>

                      <button
                        onClick={() => remove(item.product_id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 self-start space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-secondary mb-4">Résumé de la commande</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Sous-total</dt>
                    <dd className="font-medium text-secondary">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Livraison</dt>
                    <dd className="font-medium text-secondary">
                      {deliveryFee > 0 ? formatPrice(deliveryFee) : "Gratuite"}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-baseline">
                    <dt className="font-semibold text-secondary">Total</dt>
                    <dd className="text-2xl font-bold text-primary">{formatPrice(total)}</dd>
                  </div>
                </dl>
              </div>

              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold text-secondary">Vos coordonnées</h2>

                <Field
                  icon={<UserIcon size={16} />}
                  label="Nom complet"
                  required
                  value={form.customer_name}
                  onChange={(v) => setForm({ ...form, customer_name: v })}
                />
                <Field
                  icon={<Phone size={16} />}
                  label="Numéro de téléphone"
                  required
                  value={form.customer_phone}
                  onChange={(v) => setForm({ ...form, customer_phone: v })}
                  placeholder="+216 ..."
                />
                <Field
                  icon={<MapPin size={16} />}
                  label="Adresse (optionnel)"
                  value={form.customer_address}
                  onChange={(v) => setForm({ ...form, customer_address: v })}
                />
                <Field
                  icon={<FileText size={16} />}
                  label="Notes (optionnel)"
                  value={form.notes}
                  onChange={(v) => setForm({ ...form, notes: v })}
                  textarea
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                >
                  {submitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <MessageCircle size={20} />
                  )}
                  Commander via WhatsApp
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Vous serez redirigé vers WhatsApp avec les détails de la commande pré-remplis.
                </p>
              </form>
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  required,
  placeholder,
  textarea,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
        {icon} {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      )}
    </div>
  );
}
