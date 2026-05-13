"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { GridOverlay } from "./GridOverlay";

type Feature = {
  icon: React.ElementType;
  text: string;
};

export type WhyChooseUsProps = {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  features: Feature[];
  /** Shown beside the listing tiles — pass `image` & `badgeValue` to render the floating "+20 ans" badge. */
  image?: string;
  /** Caption under the badge number. Used when `image` is set. */
  badgeValue?: string;
  badgeLabel?: string;
};

const DEFAULTS = {
  eyebrow: "Pourquoi nous",
  title: (
    <>
      L'excellence à <span className="text-primary">chaque étape</span>
    </>
  ),
  description:
    "Avec plus de 20 ans d'expérience en construction métallique, nous offrons une qualité supérieure et une expertise inégalée sur chaque projet.",
};

/**
 * Dark "Why choose us" section with an icon-check list, optional floating "+20 ans" badge image.
 * Replaces the near-identical sections in HomePage (with image) and ServicesPage (no image).
 */
export function WhyChooseUs({
  eyebrow = DEFAULTS.eyebrow,
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  features,
  image,
  badgeValue = "20+",
  badgeLabel = "Années d'expérience",
}: WhyChooseUsProps) {
  return (
    <section className="py-24 bg-secondary text-white relative overflow-hidden">
      <GridOverlay />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">{eyebrow}</span>
            <h2 className="text-4xl md:text-5xl mt-3 mb-6 font-bold">{title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">{description}</p>
            <ul className="space-y-5">
              {features.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-gray-300 leading-relaxed">
                      <Icon size={16} className="inline mr-2 text-primary" />
                      {item.text}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {image && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Atelier"
                className="rounded-2xl shadow-2xl w-full"
              />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.3 }}
                className="absolute -bottom-6 -left-6 bg-primary px-8 py-6 rounded-2xl shadow-xl"
              >
                <div className="text-5xl font-bold text-white">{badgeValue}</div>
                <div className="text-white/80 text-sm uppercase tracking-wider mt-1">{badgeLabel}</div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
