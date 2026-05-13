"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Loader2,
  PlayCircle,
  ShieldCheck,
  Layers,
  Feather,
  Hammer,
  Droplets,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { api, type Project as ApiProject, type Category, type Material as ApiMaterial, type ThanksLetter as ApiThanksLetter } from "@/lib/api-client";
import {
  PORTFOLIO_CATEGORIES,
  SHOWCASE_PROJECTS,
  mapApiProject,
  img,
  onImgError,
  FALLBACK_IMG,
  type PortfolioProject,
} from "@/lib/projects-data";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LettersLightbox } from "@/components/sections/LettersLightbox";
import { CtaSection } from "@/components/sections/CtaSection";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Media = { type: "image" | "video"; src: string; poster?: string };

type Material = {
  name: string;
  description: string;
  icon: React.ElementType;
  image: string;
};

type Testimonial = {
  name: string;
  company: string;
  project: string;
  feedback: string;
  logo?: string;
};

type Certificate = {
  title: string;
  issuer: string;
  year: string;
  image: string;
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const FILTERS_FALLBACK = ["Tous", ...PORTFOLIO_CATEGORIES];

const MATERIALS_FALLBACK: Material[] = [
  {
    name: "Acier Inoxydable",
    description:
      "Inox 304 et 316 pour les ouvrages exposés et les finitions haut de gamme : garde-corps, mains courantes, habillages. Résistance maximale à la corrosion.",
    icon: ShieldCheck,
    image: img("photo-1518709268805-4e9042af9f23", 800),
  },
  {
    name: "Acier au Carbone",
    description:
      "Le matériau de référence pour les charpentes et structures porteuses. Soudures certifiées, profilés IPE, HEA, tubes et tôles fortes.",
    icon: Hammer,
    image: img("photo-1504328345606-18bbc8c9d7d1", 800),
  },
  {
    name: "Aluminium",
    description:
      "Léger, durable et inoxydable : idéal pour les pergolas, menuiseries, habillages de façade et ouvrages nécessitant finesse et légèreté.",
    icon: Feather,
    image: img("photo-1459767129954-1b1c1f9b9ace", 800),
  },
  {
    name: "Fer Forgé",
    description:
      "Le savoir-faire traditionnel au service des portails, grilles et rampes ouvragées. Chaque pièce est façonnée à la main dans nos ateliers.",
    icon: Sparkles,
    image: img("photo-1449157291145-7efd050a4d0e", 800),
  },
  {
    name: "Acier Galvanisé",
    description:
      "Protection par galvanisation à chaud pour les ouvrages extérieurs et industriels : passerelles, clôtures, structures exposées aux intempéries.",
    icon: Droplets,
    image: img("photo-1565793298595-6a879b1d9492", 800),
  },
  {
    name: "Métaux Spéciaux",
    description:
      "Acier Corten, laiton, cuivre et tôles décoratives découpées au laser pour des réalisations architecturales uniques et signées.",
    icon: Layers,
    image: img("photo-1486718448742-163732cd1544", 800),
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mohamed Ben Salah",
    company: "SFBT",
    project: "Hangar de stockage 4 200 m²",
    feedback:
      "Une équipe d'une rigueur exemplaire. Le chantier a été livré avant le délai contractuel, avec une qualité de soudure et de finition irréprochable. Nous leur avons depuis confié deux autres sites.",
    logo: "/logoz/sfbt.svg",
  },
  {
    name: "Sonia Trabelsi",
    company: "Ennakl Automobiles",
    project: "Mezzanine showroom",
    feedback:
      "Le montage a été réalisé en site occupé sans aucune interruption de notre activité. Professionnalisme, propreté du chantier et respect des engagements : nous recommandons sans réserve.",
    logo: "/logoz/ennakl.svg",
  },
  {
    name: "Karim Haddad",
    company: "IMM",
    project: "Passerelle technique industrielle",
    feedback:
      "Du bureau d'études à la pose, tout a été maîtrisé en interne. Les plans d'exécution étaient précis et la structure parfaitement conforme aux normes. Un partenaire industriel fiable.",
    logo: "/logoz/imm.svg",
  },
  {
    name: "Leïla Mansour",
    company: "Judy Hôtels",
    project: "Escalier hélicoïdal & garde-corps",
    feedback:
      "L'escalier du lobby est devenu la signature de notre hôtel. Un travail d'orfèvre sur l'acier et le bois, et une écoute remarquable tout au long du projet. Du grand art.",
    logo: "/logoz/judy.svg",
  },
];

const CERTIFICATES_FALLBACK: Certificate[] = [
  {
    title: "Lettre de remerciement",
    issuer: "SFBT – Direction Technique",
    year: "2024",
    image: img("photo-1450101499163-c8848c66ca85", 800),
  },
  {
    title: "Certificat de bonne exécution",
    issuer: "Ennakl Automobiles",
    year: "2024",
    image: img("photo-1586281380349-632531db7ed4", 800),
  },
  {
    title: "Lettre de recommandation",
    issuer: "IMM – Direction Générale",
    year: "2023",
    image: img("photo-1521587760476-6c12a4b040da", 800),
  },
  {
    title: "Certification soudure EN 1090",
    issuer: "Organisme de certification",
    year: "2022",
    image: img("photo-1554224155-8d04cb21cd6c", 800),
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// (onImgError + FALLBACK_IMG imported from @/lib/projects-data)



/* ------------------------------------------------------------------ */
/* Mappers — convert API rows into the local shapes used by the page    */
/* ------------------------------------------------------------------ */

// Pick a lucide icon based on the material title (the API has no icon field).
function iconForMaterialTitle(title: string): React.ElementType {
  const t = title.toLowerCase();
  if (t.includes("inox") || t.includes("inoxydable")) return ShieldCheck;
  if (t.includes("carbone")) return Hammer;
  if (t.includes("aluminium") || t.includes("aluminium")) return Feather;
  if (t.includes("forg")) return Sparkles;
  if (t.includes("galvan")) return Droplets;
  return Layers;
}

function mapApiMaterial(m: ApiMaterial): Material {
  return {
    name: m.title,
    description: m.description || "",
    icon: iconForMaterialTitle(m.title),
    image: m.image_url || FALLBACK_IMG,
  };
}

function mapApiThanksLetter(l: ApiThanksLetter): Certificate {
  return {
    title: l.title,
    issuer: l.author || "Lettre de remerciement",
    year: l.created_at ? new Date(l.created_at).getFullYear().toString() : "—",
    image: l.image_url || FALLBACK_IMG,
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [filters, setFilters] = useState<string[]>(FILTERS_FALLBACK);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [materials, setMaterials] = useState<Material[]>(MATERIALS_FALLBACK);
  const [certificates, setCertificates] = useState<Certificate[]>(CERTIFICATES_FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load categories + projects + materials + thanks letters in parallel;
    // gracefully fall back to static lists when an endpoint is empty or fails.
    Promise.all([
      api.get<{ items: Category[] }>("/api/categories").catch(() => null),
      api.get<{ items: ApiProject[] }>("/api/projects").catch(() => null),
      api.get<{ items: ApiMaterial[] }>("/api/materials").catch(() => null),
      api.get<{ items: ApiThanksLetter[] }>("/api/thanks").catch(() => null),
    ]).then(([catsRes, projectsRes, materialsRes, thanksRes]) => {
      if (catsRes?.items?.length) {
        setFilters(["Tous", ...catsRes.items.map((c) => c.name)]);
      }
      if (projectsRes?.items?.length) {
        setProjects(projectsRes.items.map(mapApiProject));
      } else {
        setProjects(SHOWCASE_PROJECTS);
      }
      if (materialsRes?.items?.length) {
        setMaterials(materialsRes.items.map(mapApiMaterial));
      }
      if (thanksRes?.items?.length) {
        setCertificates(thanksRes.items.map(mapApiThanksLetter));
      }
      setLoading(false);
    });
  }, []);

  const filtered =
    activeCategory === "Tous"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const countFor = (cat: string) =>
    cat === "Tous" ? projects.length : projects.filter((p) => p.category === cat).length;

  return (
    <div className="min-h-screen pt-20">
      {/* ============================== HERO ============================== */}
      <section className="relative bg-[#141414] text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl mb-4"
          >
            L&apos;Art de la <span className="text-primary">Construction Métallique</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Chaque projet est unique, conçu et fabriqué sur mesure selon vos exigences.
            Découvrez nos réalisations, nos matériaux et la confiance de nos clients.
          </motion.p>
        </div>
      </section>

      {/* ======================= FILTRES CATÉGORIES ======================= */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
                {!loading && (
                  <span
                    className={`ml-2 text-xs ${
                      activeCategory === category ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {countFor(category)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= GALERIE PROJETS ======================== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                  Aucun projet dans cette catégorie pour le moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((project) => {
                    const hasVideo = project.media.some((m) => m.type === "video");
                    return (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        hasVideo={hasVideo}
                      />
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ========================== MATÉRIAUX ========================== */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Les Matières que Nous <span className="text-primary">Maîtrisons</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Du choix de la matière à la finition, nous sélectionnons le métal le plus
              adapté à chaque usage, chaque environnement et chaque esthétique.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div
                key={material.name}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-colors hover:border-primary/50"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={material.image}
                    alt={material.name}
                    onError={onImgError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                      <material.icon className="text-white" size={20} />
                    </div>
                    <h3 className="text-lg font-bold drop-shadow-md">{material.name}</h3>
                  </div>
                </div>
                <p className="p-5 text-gray-400 text-sm leading-relaxed">
                  {material.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= TÉMOIGNAGES ========================= */}
      <TestimonialsSection
        variant="detailed"
        description="Industriels, promoteurs, hôteliers et particuliers nous confient leurs projets les plus exigeants."
        testimonials={TESTIMONIALS}
      />

      {/* ================= CERTIFICATS & LETTRES ================= */}
      <LettersLightbox
        eyebrow="Reconnaissance"
        title={<>Certificats & Lettres de <span className="text-primary">Remerciement</span></>}
        description=""
        sectionClassName="bg-secondary text-white relative overflow-hidden"
        items={certificates.map((c) => ({
          id: `${c.title}-${c.year}`,
          title: c.title,
          meta: `${c.issuer} · ${c.year}`,
          year: c.year,
          image: c.image,
        }))}
      />

      {/* ============================== CTA ============================== */}
      <CtaSection
        title="Un projet sur mesure en tête ?"
        description="Chaque ouvrage que nous livrons est unique. Parlons du vôtre : étude, conception, fabrication et pose par nos équipes."
        buttonText="Démarrer mon projet"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ProjectCard — grid card with fixed image height                     */
/* ------------------------------------------------------------------ */
function ProjectCard({
  project,
  hasVideo,
}: {
  project: PortfolioProject;
  hasVideo: boolean;
}) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative aspect-[4/3]">
          <img
            src={project.cover}
            alt={project.title}
            onError={onImgError}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
              {project.category}
            </span>
            {hasVideo && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <PlayCircle size={12} /> Vidéo
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg text-secondary font-bold mb-2 truncate">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {project.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-primary" />
              <span className="truncate max-w-[100px]">{project.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-primary" />
              <span>{project.date}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
