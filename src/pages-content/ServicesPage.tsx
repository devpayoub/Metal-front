"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Loader2,
  MessageCircle,
  Ruler,
  Factory,
  HardHat,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
} from "lucide-react";
import { api, type Service } from "@/lib/api-client";
import { iconFor } from "@/lib/icon-map";
import { Hero } from "@/components/sections/Hero";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { CtaSection } from "@/components/sections/CtaSection";

const WHY_FEATURES = [
  { icon: Award, text: "Professionnels certifiés — tous nos techniciens sont formés aux plus hauts standards, bureau d'études intégré" },
  { icon: ShieldCheck, text: "Matériaux de qualité — acier et matériaux de premier choix issus de fournisseurs de confiance" },
  { icon: Clock, text: "Livraison à temps — planification rigoureuse sans compromettre la qualité" },
];

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ items: Service[] }>("/api/services")
      .then((d) => setServices(d.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <Hero
        badge="Nos services"
        title={<>Nos <span className="text-primary">Services</span></>}
        subtitle="Des solutions complètes en construction métallique pour tous vos besoins industriels, commerciaux et résidentiels."
        orbs={[
          { size: 384, x: "33%", y: "0%", delay: 0 },
          { size: 320, x: "67%", y: "100%", delay: 1 },
        ]}
      />

      {/* ========================= SERVICES GRID ========================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : services.length === 0 ? (
            <ServiceFallback />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {services.map((service, index) => {
                const Icon = iconFor(service.icon);
                const features = Array.isArray(service.features)
                  ? service.features
                  : [];
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-r from-primary to-orange-600 p-6 relative overflow-hidden">
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl text-white font-bold">
                          {service.title}
                        </h3>
                      </div>
                      {/* Decorative circle */}
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
                    </div>
                    <div className="p-8">
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {service.long_desc || service.short_desc}
                      </p>
                      {features.length > 0 && (
                        <ul className="space-y-3">
                          {features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-3 text-gray-600"
                            >
                              <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 size={12} className="text-primary" />
                              </div>
                              <span className="text-sm">{feature}</span>
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

      {/* ========================= PROCESS ========================= */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
              Notre processus
            </span>
            <h2 className="text-4xl md:text-5xl text-secondary mt-3 font-bold">
              De l&apos;idée à la réalisation
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: MessageCircle,
                step: "01",
                title: "Consultation",
                desc: "Nous discutons de vos besoins, contraintes et objectifs pour bien comprendre votre projet.",
              },
              {
                icon: Ruler,
                step: "02",
                title: "Conception",
                desc: "Notre bureau d'études dessine les plans et calcule les structures selon les normes en vigueur.",
              },
              {
                icon: Factory,
                step: "03",
                title: "Fabrication",
                desc: "Fabrication en atelier avec des matériaux certifiés, contrôle qualité à chaque étape.",
              },
              {
                icon: HardHat,
                step: "04",
                title: "Installation",
                desc: "Montage sur site par nos équipes qualifiées, respect des délais et des normes de sécurité.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                    <Icon className="w-9 h-9 text-white" />
                  </div>
                  <div className="text-primary text-sm font-bold mb-2">
                    Étape {item.step}
                  </div>
                  <h3 className="text-xl text-secondary font-bold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gray-200" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================= WHY CHOOSE US ========================= */}
      <WhyChooseUs
        eyebrow="Nos atouts"
        title="Pourquoi choisir nos services ?"
        features={WHY_FEATURES}
      />

      {/* ============================== CTA ============================== */}
      <CtaSection
        title="Besoin d'une solution sur mesure ?"
        description="Notre équipe est prête à discuter de vos besoins spécifiques et à proposer une solution adaptée à votre projet."
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fallback when API returns empty                                     */
/* ------------------------------------------------------------------ */

function ServiceFallback() {
  const fallbackServices = [
    {
      icon: "Building2",
      title: "Structures Métalliques",
      desc: "Charpentes, ossatures et structures porteuses sur mesure pour bâtiments industriels et commerciaux de toutes tailles.",
      features: ["Charpentes en acier", "Ossatures métalliques", "Mezzanines", "Passerelles"],
    },
    {
      icon: "Factory",
      title: "Fabrication d'Acier",
      desc: "Coupe, pliage, soudure et assemblage de profilés et tôles d'acier selon les plans d'exécution les plus exigeants.",
      features: ["Découpe plasma / laser", "Pliage de tôles", "Soudure MIG / MAG / TIG", "Ajustage et assemblage"],
    },
    {
      icon: "Warehouse",
      title: "Bâtiments Industriels",
      desc: "Conception et construction de hangars, entrepôts et unités de production clé en main avec charpente métallique.",
      features: ["Hangars agricoles", "Entrepôts logistiques", "Usines et ateliers", "Surélévation"],
    },
    {
      icon: "Wrench",
      title: "Installation & Maintenance",
      desc: "Montage sur site, maintenance préventive et corrective de vos ouvrages métalliques par nos équipes spécialisées.",
      features: ["Montage charpente", "Nettoyage et peinture", "Réparation soudure", "Inspection annuelle"],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {fallbackServices.map((service, index) => {
        const Icon = iconFor(service.icon);
        return (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-primary to-orange-600 p-6 relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl text-white font-bold">{service.title}</h3>
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">{service.desc}</p>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={12} className="text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
