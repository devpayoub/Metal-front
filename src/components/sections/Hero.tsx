"use client";

import { motion } from "motion/react";
import { HERO_GRADIENT } from "@/lib/constants";
import { GridOverlay } from "./GridOverlay";

type Orb = { size: number; x: string; y: string; delay: number };

export type HeroProps = {
  /** Small badge/pill above the title (e.g. "À propos de nous"). */
  badge?: React.ReactNode;
  /** Main title — supports a highlighted span via <span className="text-primary">. */
  title: React.ReactNode;
  /** Subtitle paragraph under the title. */
  subtitle?: React.ReactNode;
  /** Optional extra content below subtitle (the title bar's feature buttons, etc). */
  children?: React.ReactNode;
  /** Decorative orbs positions. Omit for a single default orb pair. */
  orbs?: Orb[];
  /** Vertical padding class — defaults to `py-28`. */
  py?: string;
};

const DEFAULT_ORBS = [
  { size: 384, x: "25%", y: "0%", delay: 0 },
  { size: 320, x: "75%", y: "100%", delay: 1.2 },
];

/**
 * Dark gradient hero block — replaces the 3 near-identical Hero sections
 * in AboutPage / ServicesPage / ContactPage.
 */
export function Hero({
  badge,
  title,
  subtitle,
  children,
  orbs = DEFAULT_ORBS,
  py = "py-28",
}: HeroProps) {
  return (
    <section className={`relative ${HERO_GRADIENT} text-white ${py} overflow-hidden`}>
      <GridOverlay />

      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/15 blur-3xl animate-pulse pointer-events-none"
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            animationDelay: `${o.delay}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10 text-center">
        {badge && (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block border border-primary/50 text-primary tracking-[0.25em] uppercase text-xs px-5 py-2 rounded-full mb-6"
          >
            {badge}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="text-5xl md:text-7xl mb-6 font-bold tracking-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
