"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type CtaSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Text of the primary button. */
  buttonText?: string;
  /** Destination of the primary button — defaults to `/contact`. */
  buttonHref?: string;
};

const DEFAULTS = {
  title: "Prêt à démarrer votre projet ?",
  description:
    "Contactez notre équipe dès aujourd'hui pour une consultation gratuite et un devis personnalisé.",
  buttonText: "Nous contacter",
  buttonHref: "/contact",
};

/**
 * Primary-background Call-to-Action section. Replaces 5 copy-pasted variants
 * (HomePage, AboutPage, ServicesPage, ProjectsPage, ContactPage).
 */
export function CtaSection({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  buttonText = DEFAULTS.buttonText,
  buttonHref = DEFAULTS.buttonHref,
}: CtaSectionProps) {
  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl mb-6 font-bold">{title}</h2>
          {description && (
            <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90 leading-relaxed">
              {description}
            </p>
          )}
          {buttonText && buttonHref && (
            <Link
              href={buttonHref}
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 hover:shadow-xl"
            >
              {buttonText}
              <ArrowRight size={18} />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
