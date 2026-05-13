"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Briefcase, Tag, Megaphone, Calendar, Loader2 } from "lucide-react";
import { api, type Announcement } from "@/lib/api-client";

const typeMeta = {
  job: { label: "Emplois", icon: Briefcase, color: "bg-blue-500" },
  promotion: { label: "Promotions", icon: Tag, color: "bg-primary" },
  news: { label: "Actualités", icon: Megaphone, color: "bg-green-500" },
} as const;

const FILTERS = ["All", "job", "promotion", "news"] as const;

export function NewsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  useEffect(() => {
    api
      .get<{ items: Announcement[] }>("/api/announcements")
      .then((d) => setItems(d.items.filter((a) => a.published)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.type === filter)),
    [items, filter]
  );

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-to-br from-secondary via-[#1a1a1a] to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl mb-4">
              Actualités &amp; <span className="text-primary">Annonces</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Dernières mises à jour, offres d&apos;emploi et promotions de MIS Metal Construction.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f === "All" ? "Tout" : typeMeta[f as keyof typeof typeMeta].label}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-[40vh]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-20">Aucune annonce pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a, i) => {
                const meta = a.type ? typeMeta[a.type] : null;
                const Icon = meta?.icon ?? Megaphone;
                return (
                  <motion.article
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group"
                  >
                    {a.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.image_url}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {meta && (
                          <span
                            className={`absolute top-4 left-4 ${meta.color} text-white px-3 py-1 rounded-full text-xs flex items-center gap-1.5`}
                          >
                            <Icon size={12} /> {meta.label}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      {!a.image_url && meta && (
                        <span
                          className={`inline-flex items-center gap-1.5 ${meta.color} text-white px-3 py-1 rounded-full text-xs mb-3`}
                        >
                          <Icon size={12} /> {meta.label}
                        </span>
                      )}
                      <h3 className="text-xl text-secondary mb-3 group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                      {a.body && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{a.body}</p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={12} />
                        {new Date(a.created_at).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
