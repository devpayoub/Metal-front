"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { Briefcase, Tag, Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, type Service, type Announcement } from '@/lib/api-client';
import { iconFor } from '@/lib/icon-map';

const announcementMeta = {
  job: { label: 'Emploi', icon: Briefcase, color: 'bg-blue-500' },
  promotion: { label: 'Promotion', icon: Tag, color: 'bg-primary' },
  news: { label: 'Actualité', icon: Megaphone, color: 'bg-green-500' },
} as const;

export function HomePage() {
  const [counts, setCounts] = useState({ projects: 0, clients: 0, experience: 0 });
  const [services, setServices] = useState<Service[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [projectsRes, employersRes, servicesRes, announcementsRes] = await Promise.all([
          api.get<{ items: unknown[] }>('/api/projects'),
          api.get<{ items: unknown[] }>('/api/employers'),
          api.get<{ items: Service[] }>('/api/services'),
          api.get<{ items: Announcement[] }>('/api/announcements'),
        ]);
        const targetProjects = projectsRes.items.length;
        const targetClients = employersRes.items.length * 50 || 100;
        setServices(servicesRes.items.slice(0, 6));
        setAnnouncements(announcementsRes.items.filter((a) => a.published).slice(0, 3));
        animateCount(targetProjects, 'projects', 1500);
        animateCount(targetClients, 'clients', 1500);
        animateCount(20, 'experience', 1500);
      } catch {
        // soft-fail: keep zeros and empty services
      }
    })();

    function animateCount(target: number, key: string, duration: number) {
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }));
      }, duration / steps);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/cover.svg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/80"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl text-white mb-6"
          >
            L&apos;excellence en
            <br />
            <span className="text-primary">construction métallique</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Structures en acier haut de gamme et services de fabrication métallique pour projets industriels et commerciaux
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              Demander un devis
            </Link>
            <Link
              href="/projects"
              className="bg-white text-secondary px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Voir les projets
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      <PartnersBar />

      <section id="stats-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-8 bg-gray-50 rounded-lg"
            >
              <div className="text-5xl text-primary mb-4">{counts.projects}+</div>
              <h3 className="text-xl text-secondary">Projets réalisés</h3>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-8 bg-gray-50 rounded-lg"
            >
              <div className="text-5xl text-primary mb-4">{counts.clients}+</div>
              <h3 className="text-xl text-secondary">Clients satisfaits</h3>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-8 bg-gray-50 rounded-lg"
            >
              <div className="text-5xl text-primary mb-4">{counts.experience}+</div>
              <h3 className="text-xl text-secondary">Années d&apos;excellence</h3>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-secondary mb-4">Nos services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Solutions complètes en construction métallique adaptées à vos besoins
            </p>
          </motion.div>

          {services.length === 0 ? (
            <p className="text-center text-gray-400">Chargement des services…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = iconFor(service.icon);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl text-secondary mb-3">{service.title}</h3>
                    <p className="text-gray-600">{service.short_desc}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl mb-6">Pourquoi choisir MIS Metal ?</h2>
              <p className="text-gray-300 mb-6">
                Avec plus de 20 ans d&apos;expérience en construction métallique, nous offrons une qualité supérieure et
                une expertise inégalée sur chaque projet.
              </p>
              <ul className="space-y-4">
                {[
                  'Qualité certifiée ISO',
                  'Équipe d’ingénierie experte',
                  'Support projet 24/7',
                  'Livraison dans les délais garantie',
                  'Tarifs compétitifs',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white">✓</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
                alt="Metal construction"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-lg">
                <div className="text-4xl mb-2">20+</div>
                <div className="text-sm">Années d&apos;expérience</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl text-secondary mb-3">
                Actualités &amp; <span className="text-primary">Annonces</span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Dernières mises à jour, offres d&apos;emploi et promotions de MIS Metal Construction.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((a, i) => {
                const meta = a.type ? announcementMeta[a.type] : null;
                const Icon = meta?.icon ?? Megaphone;
                return (
                  <motion.article
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
                  >
                    {a.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 ${meta?.color ?? 'bg-gray-500'} text-white text-xs uppercase tracking-wider px-2.5 py-1 rounded-full`}
                        >
                          <Icon size={12} /> {meta?.label ?? 'Update'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={12} />
                          {new Date(a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg text-secondary mb-2 line-clamp-2">{a.title}</h3>
                      {a.body && (
                        <p className="text-gray-600 text-sm line-clamp-3">{a.body}</p>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:brightness-110 transition-all"
              >
                Voir toutes les actualités <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-secondary mb-4">Ce que disent nos clients</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La confiance des leaders du secteur dans toute la région
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Jean Anderson',
                company: 'ABC Manufacturing',
                text: 'MIS Metal a livré notre projet d’entrepôt dans les temps et le budget. Qualité exceptionnelle !',
              },
              {
                name: 'Sarah Mitchell',
                company: 'Industrial Solutions Inc.',
                text: 'Équipe professionnelle, communication excellente et savoir-faire supérieur. Vivement recommandé !',
              },
              {
                name: 'David Chen',
                company: 'Tech Logistics Ltd.',
                text: 'La structure en acier qu’ils ont construite est irréprochable. Quel souci du détail !',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-lg"
              >
                <div className="text-primary text-4xl mb-4">"</div>
                <p className="text-gray-700 mb-6">{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="text-secondary">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-6">Prêt à démarrer votre projet ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contactez notre équipe dès aujourd&apos;hui pour une consultation et un devis gratuits
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Nous contacter
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function PartnersBar() {
  const partners = [
    { name: 'Assad',    src: '/logoz/assad.svg' },
    { name: 'Bershka',  src: '/logoz/bershka.svg' },
    { name: 'Ennakl',   src: '/logoz/ennakl.svg' },
    { name: 'IMM',      src: '/logoz/imm.svg' },
    { name: 'Judy',     src: '/logoz/judy.svg' },
    { name: 'SFBT',     src: '/logoz/sfbt.svg' },
    { name: 'Zara',     src: '/logoz/zara.svg' },
  ];

  return (
    <div className="bg-white py-8 border-y border-gray-200 overflow-hidden">
      <div className="relative">
        <div className="flex animate-scroll w-max">
          {[...partners, ...partners].map((p, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-10 shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.name}
                className="h-12 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
