import Link from "next/link";
import { motion } from "motion/react";
import {
  Facebook,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À propos" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projets" },
    { href: "/contact", label: "Contact" },
  ];

  const services = [
    "Structures métalliques",
    "Fabrication d'acier",
    "Bâtiments industriels",
    "Soudure & assemblage",
    "Installation & maintenance",
  ];

  const contacts = [
    { icon: MapPin, text: "ZI Beni Khiar 8060, Tunisie" },
    { icon: Phone, text: "+216 31 402 151" },
    { icon: Phone, text: "+216 52 448 549" },
    { icon: Mail, text: "mbs.metalconstruction@gmail.com" },
  ];

  return (
    <footer className="bg-secondary text-white relative overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="MIS Metal Construction"
                className="h-16 w-auto object-contain bg-white/95 rounded-md p-2"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              M.B.S est une entreprise tunisienne fondée en 2015, spécialisée dans
              les constructions et fabrications métalliques de haute qualité.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-6">
              Navigation
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-6">
              Nos Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              {contacts.map((contact, i) => {
                const Icon = contact.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <Icon
                      size={16}
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-400 text-sm leading-relaxed">
                      {contact.text}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.facebook.com/M.B.S.metalconstruction"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="mailto:mbs.metalconstruction@gmail.com"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="https://wa.me/21652448549"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <Phone size={16} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} MIS Metal Construction. Tous droits réservés.
          </p>
          <p className="text-gray-600 text-xs">
            Fabrication métallique de haute qualité — Tunisie
          </p>
        </div>
      </div>
    </footer>
  );
}
