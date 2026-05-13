"use client";

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api, type Service } from '@/lib/api-client';
import { iconFor } from '@/lib/icon-map';

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ items: Service[] }>('/api/services')
      .then((d) => setServices(d.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-to-br from-secondary via-[#1a1a1a] to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl mb-6"
            >
              Nos <span className="text-primary">Services</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Des solutions complètes en construction métallique pour tous vos besoins
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Aucun service disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {services.map((service, index) => {
                const Icon = iconFor(service.icon);
                const features = Array.isArray(service.features) ? service.features : [];
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                  >
                    <motion.div
                      className="bg-primary p-6 relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-12 h-12 text-white" />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.div>
                    <div className="p-6">
                      <h3 className="text-2xl text-secondary mb-3">{service.title}</h3>
                      <p className="text-gray-700 mb-4">{service.long_desc || service.short_desc}</p>
                      {features.length > 0 && (
                        <ul className="space-y-2">
                          {features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-600">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-6">Pourquoi choisir nos services ?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Professionnels certifiés',
                description: 'Tous nos techniciens sont certifiés et formés aux plus hauts standards du métier.',
              },
              {
                title: 'Matériaux de qualité',
                description: 'Nous n\'utilisons que de l\'acier et des matériaux de premier choix issus de fournisseurs de confiance.',
              },
              {
                title: 'Livraison à temps',
                description: 'Nous tenons à respecter les délais sans compromettre la qualité.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-lg"
              >
                <h3 className="text-xl mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-6">Besoin d&apos;une solution sur mesure ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Notre équipe est prête à discuter de vos besoins spécifiques et à proposer une solution adaptée
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Nous contacter
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
