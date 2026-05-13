"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export type Testimonial = {
  name: string;
  company: string;
  /** Optional — shown after the company in ProjectsPage style. */
  project?: string;
  /** Single-line feedback. Used by HomePage style. */
  feedback?: string;
  /** Free-form body — used by ProjectsPage style. */
  text?: string;
  logo?: string;
};

export type TestimonialsSectionProps = {
  /** Optional eyebrow label above the title. */
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  testimonials: Testimonial[];
  /** `"compact"` = 3-col avatar+company cards (HomePage style); `"detailed"` = 2-col with Quote icon (ProjectsPage style). */
  variant?: "compact" | "detailed";
  /** Page size for the compact carousel (defaults to 3). When the list
   * contains more than `pageSize` items, left/right arrows are shown. */
  pageSize?: number;
};

const SECTION_HEADER_DEFAULTS = {
  eyebrow: "Témoignages",
  title: (
    <>
      La confiance de nos <span className="text-primary">clients</span>
    </>
  ),
  description:
    "Des leaders du secteur nous font confiance pour leurs projets les plus exigeants.",
};

/**
 * Testimonials section — replaces the inline cards duplicated across
 * HomePage (3 compact cards) and ProjectsPage (4 detailed cards).
 *
 * In `compact` mode, when there are more than `pageSize` (default 3)
 * testimonials, left/right arrows let the visitor page through them.
 */
export function TestimonialsSection({
  eyebrow = SECTION_HEADER_DEFAULTS.eyebrow,
  title = SECTION_HEADER_DEFAULTS.title,
  description = SECTION_HEADER_DEFAULTS.description,
  testimonials,
  variant = "compact",
  pageSize = 3,
}: TestimonialsSectionProps) {
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(pageSize);

  // Responsive: 1 on mobile, 2 on tablet, 3 on desktop — capped by pageSize prop.
  useEffect(() => {
    const update = () => {
      let n;
      if (window.innerWidth >= 1024) n = pageSize;
      else if (window.innerWidth >= 768) n = Math.min(2, pageSize);
      else n = 1;
      setPerView(n);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [pageSize]);

  const totalPages = Math.max(1, Math.ceil(testimonials.length / perView));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * perView;
  const visible = testimonials.slice(start, start + perView);
  const hasArrows = testimonials.length > perView;
  const atStart = currentPage === 0;
  const atEnd = currentPage === totalPages - 1;

  // Clamp page when items/perView change.
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  // Touch swipe for mobile.
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0 && !atEnd) setPage((p) => p + 1);
      else if (dx > 0 && !atStart) setPage((p) => p - 1);
    }
    touchStartX.current = null;
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
            {eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl text-secondary mt-3 mb-4 font-bold">
            {variant === "compact" ? title : (
              <>
                La Confiance de Nos <span className="text-primary">Clients</span>
              </>
            )}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{description}</p>
        </motion.div>

        {variant === "compact" ? (
          <div className="relative max-w-6xl mx-auto">
            {hasArrows && (
              <button
                type="button"
                aria-label="Témoignages précédents"
                disabled={atStart}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-secondary hover:bg-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-secondary transition-all duration-300"
                style={{ left: "-3rem" }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div
              className="overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {visible.map((t, i) => (
                    <motion.div
                      key={`${currentPage}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-primary text-5xl font-serif mb-4">
                        &ldquo;
                      </div>
                      <p className="text-gray-700 mb-8 leading-relaxed">
                        {t.feedback ?? t.text}
                      </p>
                      <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {t.name[0]}
                        </div>
                        <div>
                          <div className="text-secondary font-semibold">{t.name}</div>
                          <div className="text-sm text-gray-500">{t.company}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {hasArrows && (
              <button
                type="button"
                aria-label="Témoignages suivants"
                disabled={atEnd}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-secondary hover:bg-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-secondary transition-all duration-300"
                style={{ right: "-3rem" }}
              >
                <ChevronRight size={24} />
              </button>
            )}

            {hasArrows && totalPages > 1 && (
              <div className="flex justify-center gap-1.5 mt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Page ${i + 1}`}
                    onClick={() => setPage(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentPage
                        ? "w-6 bg-primary"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <Quote className="text-primary/20 mb-4" size={32} />
                <p className="text-gray-700 leading-relaxed mb-6">
                  &laquo; {t.feedback ?? t.text} &raquo;
                </p>
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-secondary font-medium">{t.name}</div>
                      <div className="text-sm text-gray-500">
                        {t.company}
                        {t.project ? ` · ${t.project}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
