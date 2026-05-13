"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Loader2,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { api, type Project as ApiProject } from "@/lib/api-client";
import {
  SHOWCASE_PROJECTS,
  mapApiProject,
  type PortfolioProject,
} from "@/lib/projects-data";

const FALLBACK_IMG =
  "https://placehold.co/900x600/141414/d4d4d4?text=MIS+Metal+Construction";

const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const el = e.currentTarget;
  if (el.src !== FALLBACK_IMG) el.src = FALLBACK_IMG;
};

export function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    api
      .get<{ project: ApiProject }>(`/api/projects/${id}`)
      .then((d) => setProject(mapApiProject(d.project)))
      .catch(() => {
        const found = SHOWCASE_PROJECTS.find((p) => p.id === id);
        setProject(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <h1 className="text-2xl text-secondary mb-4">Projet introuvable</h1>
        <Link
          href="/projects"
          className="text-primary hover:underline"
        >
          Retour aux projets
        </Link>
      </div>
    );
  }

  const currentMedia = project.media[activeImage];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Accueil
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/projects" className="hover:text-primary transition-colors">
                Projets
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-secondary font-medium truncate max-w-[300px]" title={project.title}>
              {project.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] bg-gray-900 overflow-hidden">
        <img
          src={project.cover}
          alt={project.title}
          onError={onImgError}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-primary text-white text-xs px-4 py-1.5 rounded-full mb-4"
            >
              {project.category}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl text-white font-bold max-w-4xl"
            >
              {project.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Description */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl text-secondary font-bold mb-6">
                  Description du projet
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {project.description}
                </p>
              </motion.div>
            </div>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-secondary mb-4">
                  Informations
                </h3>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={20} className="text-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Localisation</div>
                    <div className="font-medium">{project.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar size={20} className="text-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Année</div>
                    <div className="font-medium">{project.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Catégorie</div>
                    <div className="font-medium">{project.category}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/projects")}
                className="flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <ArrowLeft size={20} />
                Retour aux projets
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.media.length > 1 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl text-secondary font-bold mb-8">
              Galerie
            </h2>

            {/* Main image */}
            <div className="relative aspect-video md:aspect-[21/9] bg-black rounded-xl overflow-hidden mb-6">
              {currentMedia?.type === "video" ? (
                <video
                  src={currentMedia.src}
                  poster={currentMedia.poster}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={currentMedia?.src}
                  alt={`${project.title} - ${activeImage + 1}`}
                  onError={onImgError}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {project.media.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden transition-all ${
                    i === activeImage
                      ? "ring-2 ring-primary scale-105"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {m.type === "video" ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <PlayCircle size={20} className="text-white" />
                    </div>
                  ) : (
                    <img
                      src={m.src}
                      alt={`${project.title} - ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Single media display */}
      {project.media.length === 1 && project.media[0].type === "video" && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl text-secondary font-bold mb-8">
              Vidéo du projet
            </h2>
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden max-w-4xl mx-auto">
              <video
                src={project.media[0].src}
                poster={project.media[0].poster}
                controls
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
