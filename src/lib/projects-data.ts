import type { Project as ApiProject } from "@/lib/api-client";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Media = { type: "image" | "video"; src: string; poster?: string };

export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  cover: string;
  media: Media[];
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

// Image helpers live in lib/media.ts — import for local use + re-export for legacy callers.
import { FALLBACK_IMG as _FALLBACK_IMG, img, onImgError } from "./media";
export { onImgError };
export const FALLBACK_IMG = _FALLBACK_IMG;
export { img };

export const PORTFOLIO_CATEGORIES = [
  "Structures Industrielles",
  "Fabrication Acier",
  "Portails & Clôtures",
  "Escaliers",
  "Garde-corps",
  "Métallerie sur Mesure",
];

export const SHOWCASE_PROJECTS: PortfolioProject[] = [
  {
    id: "sc-1",
    title: "Charpente Métallique – Hangar Logistique",
    category: "Structures Industrielles",
    description:
      "Conception, fabrication et montage d'une charpente métallique de 4 200 m² pour un centre logistique. Portées de 30 m sans appui intermédiaire, bardage isolant et traitement anticorrosion complet.",
    location: "Zone Industrielle Ben Arous",
    date: "2024",
    cover: img("photo-1504328345606-18bbc8c9d7d1"),
    media: [
      { type: "image", src: img("photo-1504328345606-18bbc8c9d7d1") },
      { type: "image", src: img("photo-1565793298595-6a879b1d9492") },
      {
        type: "video",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        poster: img("photo-1504328345606-18bbc8c9d7d1"),
      },
    ],
  },
  {
    id: "sc-2",
    title: "Mezzanine Acier – Showroom Automobile",
    category: "Fabrication Acier",
    description:
      "Mezzanine autoportante en acier de 600 m² avec plancher collaborant, escalier d'accès et garde-corps intégrés. Fabrication en atelier et montage en site occupé sans interruption d'activité.",
    location: "La Charguia, Tunis",
    date: "2024",
    cover: img("photo-1487958449943-2429e8be8625"),
    media: [
      { type: "image", src: img("photo-1487958449943-2429e8be8625") },
      { type: "image", src: img("photo-1431576901776-e539bd916ba2") },
    ],
  },
  {
    id: "sc-3",
    title: "Portail Coulissant Motorisé – Résidence Les Jardins",
    category: "Portails & Clôtures",
    description:
      "Portail coulissant autoportant de 7 m en acier thermolaqué avec motorisation, contrôle d'accès et clôture barreaudée assortie sur 120 ml. Design contemporain à lames horizontales.",
    location: "La Soukra, Ariana",
    date: "2023",
    cover: img("photo-1449157291145-7efd050a4d0e"),
    media: [{ type: "image", src: img("photo-1449157291145-7efd050a4d0e") }],
  },
  {
    id: "sc-4",
    title: "Escalier Hélicoïdal – Hôtel 5 Étoiles",
    category: "Escaliers",
    description:
      "Escalier hélicoïdal en acier laqué noir avec marches en chêne massif et main courante en inox brossé. Pièce maîtresse du lobby, entièrement dessinée et fabriquée sur mesure dans nos ateliers.",
    location: "Gammarth",
    date: "2023",
    cover: img("photo-1439337153520-7082a56a81f4"),
    media: [
      { type: "image", src: img("photo-1439337153520-7082a56a81f4") },
      { type: "image", src: img("photo-1486718448742-163732cd1544") },
    ],
  },
  {
    id: "sc-5",
    title: "Garde-corps Verre & Inox – Siège Social",
    category: "Garde-corps",
    description:
      "Garde-corps en verre feuilleté et inox 316 sur 4 niveaux d'atrium. Fixations invisibles, conformité aux normes NF P01-012 et finition miroir pour un rendu haut de gamme.",
    location: "Les Berges du Lac, Tunis",
    date: "2024",
    cover: img("photo-1497366754035-f200968a6e72"),
    media: [{ type: "image", src: img("photo-1497366754035-f200968a6e72") }],
  },
  {
    id: "sc-6",
    title: "Passerelle Technique Industrielle",
    category: "Structures Industrielles",
    description:
      "Passerelle de maintenance en acier galvanisé de 45 m reliant deux unités de production, avec escaliers d'accès, caillebotis antidérapants et garde-corps normalisés.",
    location: "Zone Industrielle Mghira",
    date: "2022",
    cover: img("photo-1518709268805-4e9042af9f23"),
    media: [{ type: "image", src: img("photo-1518709268805-4e9042af9f23") }],
  },
  {
    id: "sc-7",
    title: "Pergola Bioclimatique & Habillage Façade",
    category: "Métallerie sur Mesure",
    description:
      "Pergola bioclimatique en aluminium à lames orientables et habillage de façade en tôle perforée décorative. Étude thermique, découpe laser et pose réalisées par nos équipes.",
    location: "Hammamet",
    date: "2023",
    cover: img("photo-1459767129954-1b1c1f9b9ace"),
    media: [{ type: "image", src: img("photo-1459767129954-1b1c1f9b9ace") }],
  },
  {
    id: "sc-8",
    title: "Escalier Droit à Limon Central – Villa Privée",
    category: "Escaliers",
    description:
      "Escalier droit à limon central en acier brut verni, marches en verre extra-clair et garde-corps à câbles inox. Un ouvrage aérien qui laisse circuler la lumière.",
    location: "Carthage",
    date: "2022",
    cover: img("photo-1416331108676-a22ccb276e35"),
    media: [{ type: "image", src: img("photo-1416331108676-a22ccb276e35") }],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const mapApiProject = (p: ApiProject): PortfolioProject => {
  const extra = p as ApiProject & { category?: string | null; video_url?: string | null };
  const gallery = Array.isArray(p.images)
    ? (p.images as unknown[]).filter((i): i is string => typeof i === "string")
    : [];
  const cover = p.cover_url || gallery[0] || FALLBACK_IMG;
  const media: Media[] = [
    { type: "image", src: cover },
    ...gallery.filter((g) => g !== cover).map((g): Media => ({ type: "image", src: g })),
  ];
  if (extra.video_url) media.push({ type: "video", src: extra.video_url, poster: cover });
  return {
    id: p.id,
    title: p.title,
    category: extra.category && extra.category.trim() ? extra.category : "Métallerie sur Mesure",
    description: p.description || "",
    location: p.location || "—",
    date: p.year
      ? String(p.year)
      : new Date(p.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
    cover,
    media,
  };
};
