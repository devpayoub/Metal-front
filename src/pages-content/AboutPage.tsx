"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Award,
  ShieldCheck,
  Lightbulb,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { api, type ThanksLetter, type Feedback } from "@/lib/api-client";
import { img } from "@/lib/media";
import { Hero } from "@/components/sections/Hero";
import { GridOverlay } from "@/components/sections/GridOverlay";
import { LettersLightbox } from "@/components/sections/LettersLightbox";
import { TestimonialsSection, type Testimonial } from "@/components/sections/TestimonialsSection";
import { listPublishedFeedbacks } from "@/hooks/useFeedback";

export function AboutPage() {
  const [stats, setStats] = useState({ projects: 0, clients: 0, team: 0, years: 20 });
  const [letters, setLetters] = useState<ThanksLetter[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [proj, lettersRes, fbRes] = await Promise.all([
          api.get<{ items: unknown[] }>("/api/projects"),
          api.get<{ items: ThanksLetter[] }>("/api/thanks").catch(() => ({ items: [] as ThanksLetter[] })),
          listPublishedFeedbacks().catch(() => [] as Feedback[]),
        ]);
        setStats({
          projects: proj.items.length || 150,
          clients: 100,
          team: 25,
          years: 20,
        });
        setLetters((lettersRes.items || []) as ThanksLetter[]);
        setFeedbacks(fbRes);
      } catch {
        setStats({ projects: 150, clients: 100, team: 25, years: 20 });
      }
    })();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* ============================== HERO ============================== */}
      <Hero
        badge="À propos de nous"
        title={<>MIS Metal <span className="text-primary">Construction</span></>}
        subtitle="Leader de la construction métallique en Tunisie, alliant savoir-faire artisanal et technologie de pointe depuis 2005."
        orbs={[
          { size: 384, x: "25%", y: "0%", delay: 0 },
          { size: 320, x: "75%", y: "100%", delay: 1.2 },
        ]}
      />

      {/* ========================= OUR STORY ========================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
                Notre histoire
              </span>
              <h2 className="text-4xl md:text-5xl text-secondary mt-3 mb-8 font-bold leading-tight">
                Plus de 20 ans d&apos;excellence métallique
              </h2>
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>
                  M.B.S est une entreprise tunisienne fondée en 2015, spécialisée dans
                  les constructions et fabrications métalliques. Grâce à une longue
                  expérience dans le domaine, nous proposons des solutions professionnelles
                  adaptées aux besoins du marché local et international.
                </p>
                <p>
                  Notre atelier est situé dans la région du Cap Bon, à environ 70 km de
                  Tunis, sur une superficie de 1 500 m² équipée de matériels modernes :
                  cintreuse, plieuse, poinçonneuse, scie à ruban et postes de soudure
                  semi-automatique.
                </p>
                <p>
                  Nous travaillons continuellement pour offrir des réalisations de haute
                  qualité et renforcer notre présence sur les marchés nationaux et étrangers.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={img("photo-1581092160562-40aa08e78837", 600)}
                  alt="Atelier de fabrication"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
                <img
                  src={img("photo-1504328345606-18bbc8c9d7d1", 600)}
                  alt="Structure métallique"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
                />
                <img
                  src={img("photo-1565793298595-6a879b1d9492", 600)}
                  alt="Soudure industrielle"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover -mt-8"
                />
                <img
                  src={img("photo-1487958449943-2429e8be8625", 600)}
                  alt="Charpente métallique"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== LETTRE DE REMERCIEMENT ===================== */}
      <LettersLightbox
        items={letters
          .filter((l) => l.image_url)
          .map((l) => ({
            id: l.id,
            title: l.title,
            meta: l.author || undefined,
            image: l.image_url!,
          }))}
      />

      {/* ========================= VALUES ========================= */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <GridOverlay />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
              Nos valeurs
            </span>
            <h2 className="text-4xl md:text-5xl mt-3 font-bold">
              Les piliers de notre engagement
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Qualité",
                desc: "Excellence dans chaque soudure, chaque poutre, chaque projet livré.",
              },
              {
                icon: ShieldCheck,
                title: "Sécurité",
                desc: "Engagement sans compromis pour la sécurité des équipes et des chantiers.",
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                desc: "Adoption continue des nouvelles technologies et méthodes de fabrication.",
              },
              {
                icon: HeartHandshake,
                title: "Intégrité",
                desc: "Des relations honnêtes et transparentes avec tous nos partenaires.",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-primary/40 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================= STATS ========================= */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: `${stats.projects}`, label: "Projets réalisés", suffix: "+" },
              { number: `${stats.clients}`, label: "Clients satisfaits", suffix: "+" },
              { number: `${stats.team}`, label: "Membres d'équipe", suffix: "+" },
              { number: `${stats.years}`, label: "Années d'expérience", suffix: "+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= WORKSHOP GALLERY ========================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
              Notre atelier
            </span>
            <h2 className="text-4xl md:text-5xl text-secondary mt-3 font-bold">
              Ouvrez les portes de nos installations
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              img("photo-1504307651254-35680f356dfd", 600),
              img("photo-1581092160562-40aa08e78837", 600),
              img("photo-1504328345606-18bbc8c9d7d1", 600),
              img("photo-1565793298595-6a879b1d9492", 600),
            ].map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl aspect-square"
              >
                <img
                  src={src}
                  alt={`Atelier ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/40 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= TÉMOIGNAGES ========================= */}
      <TestimonialsSection
        variant="compact"
        testimonials={feedbacks.map<Testimonial>((f) => ({
          name: f.name,
          company: f.company ?? "Client MIS",
          feedback: f.description,
        }))}
      />

      {/* ============================== CTA ============================== */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-secondary rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl mb-6 font-bold">
                Travaillez avec nous
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-400 leading-relaxed">
                De la conception à la livraison, nous sommes votre partenaire de confiance
                pour tous vos projets de construction métallique.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-medium hover:brightness-110 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
              >
                Démarrer un projet
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
