"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Award,
  Layers,
  ShieldCheck,
  Clock,
  Wrench,
  Users,
} from "lucide-react";
import { api, type Service, type Material, type ThanksLetter, type Feedback } from "@/lib/api-client";
import { iconFor } from "@/lib/icon-map";
import { Hero } from "@/components/sections/Hero";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { TestimonialsSection, type Testimonial } from "@/components/sections/TestimonialsSection";
import { LettersLightbox } from "@/components/sections/LettersLightbox";
import { CtaSection } from "@/components/sections/CtaSection";
import { GridOverlay } from "@/components/sections/GridOverlay";
import { listPublishedFeedbacks } from "@/hooks/useFeedback";

const HOME_TESTIMONIALS_FALLBACK = [
  { name: "Mohamed Ben Salah", company: "SFBT", feedback: "Une équipe d'une rigueur exemplaire. Le chantier a été livré dans les temps avec une qualité de soudure et de finition irréprochable." },
  { name: "Sonia Trabelsi", company: "Ennakl Automobiles", feedback: "Le montage a été réalisé sans interruption de notre activité. Professionnalisme, propreté et respect des engagements." },
  { name: "Karim Haddad", company: "IMM", feedback: "Du bureau d'études à la pose, tout a été maîtrisé en interne. Les plans étaient précis et la structure parfaitement conforme aux normes." },
];

const WHY_FEATURES = [
  { icon: Award, text: "Qualité certifiée ISO — procédures rigoureuses à chaque étape" },
  { icon: Users, text: "Équipe d'ingénierie experte — bureau d'études intégré" },
  { icon: Clock, text: "Livraison dans les délais garantie — respect des engagements" },
  { icon: ShieldCheck, text: "Normes de sécurité les plus strictes — chantiers zéro accident" },
  { icon: Wrench, text: "Matériaux de premier choix — acier certifié et contrôlé" },
];

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface StatItem {
  value: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export function HomePage() {
  const [counts, setCounts] = useState({ projects: 0, clients: 0, experience: 20 });
  const [services, setServices] = useState<Service[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [letters, setLetters] = useState<ThanksLetter[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [animatedStats, setAnimatedStats] = useState<StatItem[]>([
    { value: "0", label: "Projets réalisés" },
    { value: "0", label: "Clients satisfaits" },
    { value: "0", label: "Années d'excellence" },
  ]);

  useEffect(() => {
    (async () => {
      const empty = { items: [] as unknown[] };
      const safe = <T,>(p: Promise<T>, fallback: T): Promise<T> => p.catch(() => fallback);
      const [projectsRes, employersRes, servicesRes, materialsRes, lettersRes, fbRes] = await Promise.all([
        safe(api.get<{ items: unknown[] }>("/api/projects"), empty),
        safe(api.get<{ items: unknown[] }>("/api/employers"), empty),
        safe(api.get<{ items: Service[] }>("/api/services"), { items: [] as Service[] }),
        safe(api.get<{ items: Material[] }>("/api/materials"), { items: [] as Material[] }),
        safe(api.get<{ items: ThanksLetter[] }>("/api/thanks"), { items: [] as ThanksLetter[] }),
        safe(listPublishedFeedbacks(), [] as Feedback[]),
      ]);
      const projects = (projectsRes.items || []).length;
      const clients = (employersRes.items || []).length * 50 || 100;
      setCounts({ projects, clients, experience: 20 });
      setServices((servicesRes.items || []).slice(0, 4));
      setMaterials((materialsRes.items || []) as Material[]);
      setLetters((lettersRes.items || []) as ThanksLetter[]);
      setFeedbacks(fbRes);
      if (projects === 0 && (servicesRes.items || []).length === 0) {
        setCounts({ projects: 150, clients: 100, experience: 20 });
      }
    })();
  }, []);

  // Animate stats once counts are loaded
  useEffect(() => {
    if (counts.projects === 0) return;
    const targets = [
      counts.projects,
      counts.clients,
      counts.experience,
    ];
    const labels = ["Projets réalisés", "Clients satisfaits", "Années d'excellence"];
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timers: ReturnType<typeof setInterval>[] = [];

    targets.forEach((target, i) => {
      let current = 0;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) current = target;
        setAnimatedStats((prev) => {
          const next = [...prev];
          next[i] = { value: Math.floor(current).toString(), label: labels[i] };
          return next;
        });
        if (current >= target) clearInterval(timer);
      }, interval);
      timers.push(timer);
    });

    return () => timers.forEach(clearInterval);
  }, [counts.projects, counts.clients, counts.experience]);

  return (
    <div className="min-h-screen">
      {/* ============================== HERO ============================== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/cover.svg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-secondary/90" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-block border border-primary/50 text-primary tracking-[0.25em] uppercase text-xs px-5 py-2 rounded-full mb-6 backdrop-blur-sm"
          >
            Construction Métallique de Haute Qualité
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-bold tracking-tight leading-tight"
          >
            L&apos;excellence en
            <br />
            <span className="text-primary">construction métallique</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Structures en acier haut de gamme et services de fabrication métallique
            pour projets industriels et commerciaux — sur mesure, depuis 2005.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="group bg-primary text-white px-8 py-4 rounded-xl hover:brightness-110 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 font-medium inline-flex items-center justify-center gap-2"
            >
              Demander un devis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/projects"
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium inline-flex items-center justify-center"
            >
              Voir nos projets
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-xs uppercase tracking-widest">Découvrir</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* ========================== PARTNERS BAR ========================== */}
      <PartnersBar />

      {/* =========================== STATS =========================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
              Nos réalisations
            </span>
            <h2 className="text-4xl md:text-5xl text-secondary mt-3 font-bold">
              Des chiffres qui parlent
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {animatedStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="text-5xl md:text-6xl text-primary font-bold mb-3">
                  {stat.value}+
                </div>
                <div className="text-gray-600 font-medium uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= SERVICES PREVIEW ========================= */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <GridOverlay />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
              Nos expertises
            </span>
            <h2 className="text-4xl md:text-5xl mt-3 mb-4 font-bold">
              Ce que nous faisons
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Des solutions complètes en construction métallique adaptées à vos besoins
            </p>
          </motion.div>

          {services.length === 0 ? (
            <ServiceFallbackGrid />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = iconFor(service.icon);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                      <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl text-white font-semibold mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {service.short_desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4"
            >
              Voir tous nos services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================== MATÉRIAUX =========================== */}
      <MaterialsSection materials={materials} />

      {/* ======================= WHY CHOOSE US ======================= */}
      <WhyChooseUs
        features={WHY_FEATURES}
        image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
        badgeValue="20+"
        badgeLabel="Années d'expérience"
      />

      {/* ========================= TESTIMONIALS ========================= */}
      <TestimonialsSection
        variant="compact"
        testimonials={
          feedbacks.length > 0
            ? feedbacks.map<Testimonial>((f) => ({
                name: f.name,
                company: f.company ?? "Client MIS",
                feedback: f.description,
              }))
            : HOME_TESTIMONIALS_FALLBACK
        }
      />

      {/* ====================== LETTRES (GRID) ====================== */}
      <LettersLightbox
        eyebrow="Reconnaissance"
        title={<>Certificats & Lettres de <span className="text-primary">Remerciement</span></>}
        description=""
        sectionClassName="bg-secondary text-white relative overflow-hidden"
        items={(letters.length > 0 ? letters : HOME_LETTERS_FALLBACK)
          .filter((l) => l.image_url)
          .map((l) => ({
            id: l.id,
            title: l.title,
            meta: l.author || undefined,
            image: l.image_url!,
          }))}
      />

      {/* ============================== CTA ============================== */}
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fallback letters (used when API returns none)                        */
/* ------------------------------------------------------------------ */
const HOME_LETTERS_FALLBACK: ThanksLetter[] = [
  {
    id: "fb-1",
    title: "Lettre de Remerciement",
    subtitle: null,
    body: null,
    author: "Direction Technique — SFBT",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    position: 0,
    published: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fb-2",
    title: "Recommandation",
    subtitle: null,
    body: null,
    author: "Direction Générale — IMM",
    image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
    position: 1,
    published: true,
    created_at: "",
    updated_at: "",
  },
];

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function PartnersBar() {
  const partners = [
    { name: "Assad", src: "/logoz/assad.svg" },
    { name: "Bershka", src: "/logoz/bershka.svg" },
    { name: "Ennakl", src: "/logoz/ennakl.svg" },
    { name: "IMM", src: "/logoz/imm.svg" },
    { name: "Judy", src: "/logoz/judy.svg" },
    { name: "SFBT", src: "/logoz/sfbt.svg" },
    { name: "Zara", src: "/logoz/zara.svg" },
  ];

  return (
    <div className="bg-white py-10 border-y border-gray-200 overflow-hidden">
      <div className="relative">
        <div className="flex animate-scroll w-max">
          {[...partners, ...partners].map((p, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-12 shrink-0"
            >
              <img
                src={p.src}
                alt={p.name}
                className="h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

function MaterialsSection({ materials }: { materials: Material[] }) {
  const [active, setActive] = useState(0);

  const FALLBACK: Material[] = [
    {
      id: "fb-m1",
      title: "Acier au Carbone",
      description:
        "Le matériau de référence pour les charpentes et structures porteuses. Profilés IPE, HEA, tubes et tôles fortes, soudure certifiée.",
      image_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80",
      position: 0,
      published: true,
      created_at: "",
      updated_at: "",
    },
    {
      id: "fb-m2",
      title: "Acier Inoxydable",
      description:
        "Inox 304 et 316 pour finitions haut de gamme : garde-corps, mains courantes, habillages. Résistance maximale à la corrosion.",
      image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
      position: 1,
      published: true,
      created_at: "",
      updated_at: "",
    },
    {
      id: "fb-m3",
      title: "Aluminium",
      description:
        "Léger, durable et inoxydable : pergolas, menuiseries, habillages de façade. Finesse et légèreté.",
      image_url: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=1200&q=80",
      position: 2,
      published: true,
      created_at: "",
      updated_at: "",
    },
    {
      id: "fb-m4",
      title: "Fer Forgé",
      description:
        "Savoir-faire traditionnel pour portails, grilles et rampes ouvragées. Façonnée à la main dans nos ateliers.",
      image_url: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1200&q=80",
      position: 3,
      published: true,
      created_at: "",
      updated_at: "",
    },
  ];

  const list = materials.length > 0 ? materials : FALLBACK;
  const current = list[active];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
            Nos matières
          </span>
          <h2 className="text-4xl md:text-5xl text-secondary mt-3 mb-4 font-bold">
            Les matériaux que nous <span className="text-primary">maîtrisons</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Du choix de la matière à la finition, nous sélectionnons le métal le plus adapté
            à chaque usage, chaque environnement et chaque esthétique.
          </p>
        </motion.div>

        {materials.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <Layers size={48} className="mx-auto mb-4 opacity-30" />
            <p>Les matérielles apparaîtront ici une fois configurées.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Left: list */}
            <div className="space-y-2">
              {materials.map((m, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={m.id}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`w-full text-left rounded-xl p-5 border transition-all duration-300 ${
                      isActive
                        ? "bg-white border-primary shadow-lg"
                        : "bg-white/60 border-gray-100 hover:bg-white hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Layers size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold truncate ${
                            isActive ? "text-secondary" : "text-gray-700"
                          }`}
                        >
                          {m.title}
                        </h3>
                        {isActive && m.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: big image */}
            <motion.div
              key={current?.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200"
            >
              {current?.image_url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.image_url}
                    alt={current.title}
                    className="w-full h-[460px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/10 to-transparent" />
                </>
              ) : (
                <div className="w-full h-[460px] flex items-center justify-center text-gray-400">
                  <Layers size={48} className="opacity-30" />
                </div>
              )}
              {current && (
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl font-bold drop-shadow-md">
                    {current.title}
                  </h3>
                  {current.description && (
                    <p className="text-white/80 text-sm mt-2 line-clamp-2">
                      {current.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceFallbackGrid() {
  const fallbackServices = [
    {
      icon: "Building2",
      title: "Structures Métalliques",
      desc: "Charpentes, ossatures et structures porteuses sur mesure pour bâtiments industriels et commerciaux.",
    },
    {
      icon: "Factory",
      title: "Fabrication d'Acier",
      desc: "Coupe, pliage, soudure et assemblage de profilés et tôles d'acier selon les plans d'exécution.",
    },
    {
      icon: "Warehouse",
      title: "Bâtiments Industriels",
      desc: "Conception et construction de hangars, entrepôts et unités de production clé en main.",
    },
    {
      icon: "Wrench",
      title: "Installation & Maintenance",
      desc: "Montage sur site, maintenance préventive et corrective de vos ouvrages métalliques.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {fallbackServices.map((service, index) => {
        const Icon = iconFor(service.icon);
        return (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl text-white font-semibold mb-3">
              {service.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {service.desc}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
