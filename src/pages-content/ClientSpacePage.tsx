"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ShoppingBag,
  Loader2,
  Save,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { api, type Order, type PublicSettings } from "@/lib/api-client";
import { ImageDrop } from "@/components/ImageDrop";
import { ClientGuard } from "@/components/client/ClientGuard";
import { ClientShell, type ClientSection } from "@/components/client/ClientShell";

type ProfileRecord = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
};

export function ClientSpacePage() {
  return (
    <ClientGuard>
      <ClientSpaceInner />
    </ClientGuard>
  );
}

function ClientSpaceInner() {
  const { user } = useAuth();

  const [section, setSection] = useState<ClientSection>("dashboard");
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [settings, setSettings] = useState<PublicSettings>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const d = await api.get<{ profile: ProfileRecord | null }>("/api/profile", true);
        if (d.profile) {
          setProfile(d.profile);
          setForm({
            full_name: d.profile.full_name || "",
            phone: d.profile.phone || "",
            address: d.profile.address || "",
            avatar_url: d.profile.avatar_url || "",
          });
        }
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const d = await api.get<{ items: Order[] }>("/api/orders/mine", true);
        setOrders(d.items || []);
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setOrdersLoading(false);
      }
    })();
    api
      .get<{ settings: PublicSettings }>("/api/settings/public")
      .then((d) => setSettings(d.settings))
      .catch(() => setSettings({}));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const patch: Record<string, string> = {};
      for (const k of ["full_name", "phone", "address", "avatar_url"] as const) {
        if (form[k]) patch[k] = form[k];
      }
      const d = await api.put<{ profile: ProfileRecord }>("/api/profile", patch);
      setProfile(d.profile);
      toast.success("Profil enregistré");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string) ||
    user?.email?.split("@")[0] ||
    "client";

  const currency = settings.currency || "DT";

  return (
    <ClientShell
      section={section}
      onSectionChange={setSection}
      displayName={displayName}
      avatarUrl={form.avatar_url || profile?.avatar_url}
      email={user?.email}
    >
      <div>
        {section === "dashboard" && (
          <DashboardSection
            displayName={displayName}
            orders={orders}
            ordersLoading={ordersLoading}
            currency={currency}
          />
        )}
        {section === "profile" && (
          <ProfileSection
            email={user?.email || ""}
            profile={profile}
            form={form}
            setForm={setForm}
            saving={saving}
            loading={profileLoading}
            onSave={handleSave}
            onAvatarChange={async (url) => {
              setForm((f) => ({ ...f, avatar_url: url || "" }));
              if (url) {
                try {
                  const d = await api.put<{ profile: ProfileRecord }>("/api/profile", {
                    avatar_url: url,
                  });
                  setProfile(d.profile);
                  toast.success("Avatar mis à jour");
                } catch (err) {
                  toast.error((err as Error).message);
                }
              }
            }}
          />
        )}
        {section === "orders" && (
          <OrdersSection orders={orders} loading={ordersLoading} currency={currency} />
        )}
      </div>
    </ClientShell>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-secondary">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}

function DashboardSection({
  displayName,
  orders,
  ordersLoading,
  currency,
}: {
  displayName: string;
  orders: Order[];
  ordersLoading: boolean;
  currency: string;
}) {
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  return (
    <div>
      <SectionHeader
        title={`Bon retour, ${displayName}`}
        subtitle="Aperçu de votre compte"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: ShoppingBag,
            label: "Total commandes",
            value: ordersLoading ? "…" : String(orders.length),
            color: "bg-primary",
          },
          {
            icon: Clock,
            label: "En attente",
            value: ordersLoading ? "…" : String(pending),
            color: "bg-amber-500",
          },
          {
            icon: CheckCircle2,
            label: "Livrées",
            value: ordersLoading ? "…" : String(delivered),
            color: "bg-green-500",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div
              className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center mb-4`}
            >
              <s.icon className="text-white" size={24} />
            </div>
            <div className="text-3xl text-secondary mb-1">{s.value}</div>
            <div className="text-gray-600">{s.label}</div>
          </motion.div>
        ))}
      </div>
      {!ordersLoading && orders.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total dépensé</div>
          <div className="text-2xl font-bold text-primary">
            {totalSpent.toFixed(2)} {currency}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSection({
  email,
  profile,
  form,
  setForm,
  saving,
  loading,
  onSave,
  onAvatarChange,
}: {
  email: string;
  profile: ProfileRecord | null;
  form: { full_name: string; phone: string; address: string; avatar_url: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ full_name: string; phone: string; address: string; avatar_url: string }>
  >;
  saving: boolean;
  loading: boolean;
  onSave: (e: React.FormEvent) => void;
  onAvatarChange: (url: string | null) => void;
}) {
  return (
    <div>
      <SectionHeader title="Mon profil" subtitle="Gérez vos informations personnelles" />
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 flex justify-center">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-secondary mb-3">Avatar</h3>
            <ImageDrop
              value={form.avatar_url || profile?.avatar_url || null}
              onChange={onAvatarChange}
              endpoint="/api/profile/avatar"
              shape="circle"
              height={200}
            />
          </div>

          <form
            onSubmit={onSave}
            className="md:col-span-2 bg-white rounded-lg shadow p-6 space-y-4"
          >
            <Field
              icon={<UserIcon size={16} />}
              label="Nom complet"
              value={form.full_name}
              onChange={(v) => setForm({ ...form, full_name: v })}
            />
            <Field icon={<Mail size={16} />} label="Email" value={email} disabled />
            <Field
              icon={<Phone size={16} />}
              label="Téléphone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Field
              icon={<MapPin size={16} />}
              label="Adresse"
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
              textarea
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-5 py-2.5 rounded-lg hover:brightness-110 flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Enregistrer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function OrdersSection({
  orders,
  loading,
  currency,
}: {
  orders: Order[];
  loading: boolean;
  currency: string;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 flex justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <SectionHeader title="Mes commandes" />
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <Package size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-5">Vous n&apos;avez encore passé aucune commande.</p>
          <Link
            href="/shop"
            className="inline-flex bg-primary text-white px-6 py-2.5 rounded-lg hover:brightness-110"
          >
            Parcourir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Mes commandes" subtitle={`${orders.length} commande(s) dans votre historique`} />
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} currency={currency} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order, currency }: { order: Order; currency: string }) {
  const date = new Date(order.created_at).toLocaleDateString();
  const invoiceReady = ["confirmed", "shipped", "delivered"].includes(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 8)}</div>
          <div className="text-sm text-gray-600">{date}</div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          {invoiceReady && (
            <Link
              href={`/client/orders/${order.id}/facture`}
              target="_blank"
              rel="noopener noreferrer"
              title="Télécharger la facture (PDF)"
              className="inline-flex items-center gap-1.5 text-primary hover:bg-primary/10 px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
            >
              <Download size={16} /> Facture
            </Link>
          )}
        </div>
      </div>
      <div className="space-y-2 border-t border-gray-100 pt-3">
        {order.items.map((it, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {it.name} <span className="text-gray-400">× {it.qty}</span>
            </span>
            <span className="text-gray-600">
              {Number(it.line_total).toFixed(2)} {currency}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-baseline border-t border-gray-100 pt-3 mt-3">
        <span className="text-sm text-gray-600">Total</span>
        <span className="text-lg font-bold text-primary">
          {Number(order.total).toFixed(2)} {currency}
        </span>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], { label: string; cls: string; Icon: typeof Clock }> = {
    pending: { label: "En attente", cls: "bg-amber-100 text-amber-700", Icon: Clock },
    confirmed: { label: "Confirmée", cls: "bg-blue-100 text-blue-700", Icon: CheckCircle2 },
    shipped: { label: "Expédiée", cls: "bg-purple-100 text-purple-700", Icon: Truck },
    delivered: { label: "Livrée", cls: "bg-green-100 text-green-700", Icon: CheckCircle2 },
    cancelled: { label: "Annulée", cls: "bg-red-100 text-red-700", Icon: XCircle },
  };
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${m.cls}`}
    >
      <m.Icon size={12} /> {m.label}
    </span>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  disabled,
  textarea,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
        {icon} {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
        />
      )}
    </div>
  );
}
