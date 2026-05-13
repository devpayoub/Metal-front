"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, Loader2 } from "lucide-react";
import { api, type Employer } from "@/lib/api-client";

export function TeamPage() {
  const [items, setItems] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ items: Employer[] }>("/api/employers")
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-to-br from-secondary via-[#1a1a1a] to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl mb-4">
              Notre <span className="text-primary">Équipe</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Ingénieurs, soudeurs et chefs de projet qui livrent l&apos;excellence sur chaque chantier.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-[40vh]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 py-20">Aucun membre d&apos;équipe pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden text-center pb-6"
                >
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {m.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.photo_url}
                        alt={m.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                        {m.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="px-4 pt-5">
                    <h3 className="text-lg text-secondary">{m.full_name}</h3>
                    {m.role && <div className="text-sm text-primary mt-1">{m.role}</div>}
                    {m.bio && <p className="text-xs text-gray-500 mt-3 line-clamp-3">{m.bio}</p>}
                    <div className="flex justify-center gap-3 mt-4 text-gray-400">
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="hover:text-primary"
                          aria-label="Email"
                        >
                          <Mail size={16} />
                        </a>
                      )}
                      {m.phone && (
                        <a
                          href={`tel:${m.phone}`}
                          className="hover:text-primary"
                          aria-label="Téléphone"
                        >
                          <Phone size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
