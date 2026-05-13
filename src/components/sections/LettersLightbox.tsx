"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Award, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

type ImgItem = {
  id: string;
  title: string;
  /** Subline shown below the title — `author` for thanks, `Issuer · year` for certs. */
  meta?: string;
  /** Year for the Award pill (certificate-style). Omit to skip the pill. */
  year?: string;
  image: string;
};

export type LettersLightboxProps = {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
  items: ImgItem[];
  /** Background of the section. Defaults to "bg-white". Pass e.g. "bg-secondary text-white" for dark. */
  sectionClassName?: string;
};

const DEFAULTS = {
  eyebrow: "Reconnaissance",
  title: (
    <>
      Nos lettres de <span className="text-primary">remerciement</span>
    </>
  ),
  description: "Des partenaires qui nous confient leurs projets les plus exigeants.",
};

/**
 * Certificate/thanks-letter grid with a lightbox modal. Replaces the two
 * near-identical implementations in HomePage (`ThanksLettersGrid`) and
 * ProjectsPage (Certificates section + lightbox).
 *
 * Pass `year` to render the certificate-style "Award · year" pill;
 * pass `meta` instead for the thanks-style "author" line.
 *
 * When more than `pageSize` items are provided, left/right arrows let the
 * visitor page through them (4 per page on desktop, 2 on mobile).
 */
export function LettersLightbox({
  eyebrow = DEFAULTS.eyebrow,
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  items,
  sectionClassName = "bg-white",
}: LettersLightboxProps) {
  const [active, setActive] = useState<ImgItem | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);

  // Responsive page size: 2 on small screens, 4 on large ones.
  useEffect(() => {
    const update = () => setPageSize(window.innerWidth >= 1024 ? 4 : 2);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * pageSize;
  const visible = items.slice(start, start + pageSize);
  const hasArrows = items.length > pageSize;
  const atStart = currentPage === 0;
  const atEnd = currentPage === totalPages - 1;

  // Clamp page when items or page size changes.
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  // Track drag for swipe-to-page on touch devices.
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

  const Arrow = ({ dir }: { dir: "prev" | "next" }) => {
    const isPrev = dir === "prev";
    const disabled = isPrev ? atStart : atEnd;
    return (
      <button
        type="button"
        aria-label={isPrev ? "Précédent" : "Suivant"}
        disabled={disabled}
        onClick={() => setPage((p) => Math.max(0, Math.min(totalPages - 1, p + (isPrev ? -1 : 1))))}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-secondary"
        style={isPrev ? { left: "-3rem" } : { right: "-3rem" }}
      >
        {isPrev ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
    );
  };

  return (
    <section className={`py-20 ${sectionClassName}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
            {eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mt-3 mb-4">
            {sectionClassName.includes("bg-secondary") ? (
              <span className="text-white">{title}</span>
            ) : (
              title
            )}
          </h2>
          <p className={`max-w-2xl mx-auto ${sectionClassName.includes("bg-secondary") ? "text-gray-400" : "text-gray-600"}`}>
            {description}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {hasArrows && <Arrow dir="prev" />}

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
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {visible.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => setActive(it)}
                    className="text-left bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-primary/40 transition-colors"
                  >
                    <div className="relative aspect-[3/4]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.image}
                        alt={it.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ZoomIn className="text-white opacity-0 hover:opacity-100" size={32} />
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 text-primary text-xs mb-1">
                        <Award size={14} />
                        <span>{it.year ?? "Lettre"}</span>
                      </div>
                      <div className="text-secondary text-sm font-medium line-clamp-1">{it.title}</div>
                      {it.meta && (
                        <div className="text-gray-500 text-xs mt-1 line-clamp-1">{it.meta}</div>
                      )}
                    </div>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {hasArrows && <Arrow dir="next" />}

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
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt={active.title}
                  className="w-full max-h-[70vh] object-contain bg-gray-100"
                />
                <button
                  onClick={() => setActive(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow"
                  aria-label="Close"
                >
                  <X className="text-gray-800" size={20} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-secondary">{active.title}</h3>
                {active.meta && <p className="text-gray-500 text-sm">{active.meta}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
