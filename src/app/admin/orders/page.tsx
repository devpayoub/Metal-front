"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Trash2, ChevronDown, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";
import { api, type Order } from "@/lib/api-client";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ items: Order[] }>("/api/orders", true);
      setOrders(data.items);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const data = await api.put<{ order: Order }>(`/api/orders/${id}`, { status });
      setOrders((o) => o.map((r) => (r.id === id ? data.order : r)));
      toast.success("Statut mis à jour");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette commande ?")) return;
    try {
      await api.delete(`/api/orders/${id}`);
      setOrders((o) => o.filter((r) => r.id !== id));
      toast.success("Supprimée");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const totalSum = orders.reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Commandes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} commande(s) · Chiffre d&apos;affaires :{" "}
            <span className="text-secondary font-medium">{totalSum.toFixed(2)} DT</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucune commande pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium w-8"></th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Client</th>
                  <th className="text-left px-4 py-3 font-medium">Téléphone</th>
                  <th className="text-right px-4 py-3 font-medium">Articles</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => {
                  const isOpen = expanded === o.id;
                  return (
                    <Fragment key={o.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpanded(isOpen ? null : o.id)}
                            className="text-gray-400 hover:text-primary"
                            aria-label={isOpen ? "Réduire" : "Développer"}
                          >
                            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(o.created_at).toLocaleString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3 font-medium text-secondary">
                          {o.customer_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{o.customer_phone}</td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {o.items.reduce((s, i) => s + i.qty, 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          {Number(o.total).toFixed(2)} DT
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              STATUS_COLORS[o.status] || "bg-gray-100"
                            } border-0 focus:ring-2 focus:ring-primary`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABELS[s] || s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {["confirmed", "shipped", "delivered"].includes(o.status) && (
                            <Link
                              href={`/client/orders/${o.id}/facture`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Télécharger la facture (PDF)"
                              className="inline-flex text-gray-400 hover:text-primary mr-2 align-middle"
                            >
                              <Download size={16} />
                            </Link>
                          )}
                          <button
                            onClick={() => remove(o.id)}
                            className="text-gray-400 hover:text-red-600 align-middle"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="bg-gray-50">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              <div>
                                <div className="text-gray-500 mb-1">Adresse</div>
                                <div className="text-secondary">
                                  {o.customer_address || "—"}
                                </div>
                                {o.notes && (
                                  <>
                                    <div className="text-gray-500 mt-3 mb-1">Notes</div>
                                    <div className="text-secondary whitespace-pre-line">
                                      {o.notes}
                                    </div>
                                  </>
                                )}
                              </div>
                              <div>
                                <div className="text-gray-500 mb-2">Articles</div>
                                <ul className="space-y-1">
                                  {o.items.map((i, idx) => (
                                    <li
                                      key={idx}
                                      className="flex justify-between text-secondary"
                                    >
                                      <span>
                                        {i.name} × {i.qty}
                                      </span>
                                      <span>{Number(i.line_total).toFixed(2)} DT</span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="border-t border-gray-200 mt-2 pt-2 space-y-1">
                                  <div className="flex justify-between text-gray-600">
                                    <span>Sous-total</span>
                                    <span>{Number(o.subtotal).toFixed(2)} DT</span>
                                  </div>
                                  <div className="flex justify-between text-gray-600">
                                    <span>Livraison</span>
                                    <span>{Number(o.delivery_fee).toFixed(2)} DT</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-secondary">
                                    <span>Total</span>
                                    <span>{Number(o.total).toFixed(2)} DT</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
