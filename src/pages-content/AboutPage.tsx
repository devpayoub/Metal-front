"use client";

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Award, Target, Eye } from 'lucide-react';
import { api, type Employer } from '@/lib/api-client';

export function AboutPage() {
  const [stats, setStats] = useState({ projects: 0, clients: 0, team: 0, years: 20 });

  useEffect(() => {
    (async () => {
      try {
        const [emp, proj] = await Promise.all([
          api.get<{ items: Employer[] }>('/api/employers'),
          api.get<{ items: unknown[] }>('/api/projects'),
        ]);
        setStats({
          projects: proj.items.length,
          clients: emp.items.length * 50 || 100,
          team: emp.items.length,
          years: 20,
        });
      } catch {
        // soft-fail
      }
    })();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-to-br from-secondary via-[#1a1a1a] to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl mb-6"
            >
              À propos de <span className="text-primary">MIS Metal</span> Construction
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Leader du secteur de la construction métallique et des structures en acier depuis 2005
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl text-secondary mb-6">Notre histoire</h2>
              <p className="text-gray-700 mb-4">
                M.B.S est une entreprise tunisienne fondée en 2015, spécialisée dans les constructions
                et fabrications métalliques. Grâce à une longue expérience dans le domaine, nous proposons
                des solutions professionnelles adaptées aux besoins du marché local et international.
              </p>
              <p className="text-gray-700">
                Notre atelier est situé dans la région du Cap Bon, à environ 70 km de Tunis, sur une
                superficie de 1 500 m² équipée de matériels modernes. Nous travaillons continuellement
                pour offrir des réalisations de haute qualité et renforcer notre présence sur les marchés
                nationaux et étrangers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"
                alt="Construction team"
                className="rounded-lg shadow-xl"
              />
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
            <h2 className="text-4xl text-secondary mb-4">Notre mission &amp; notre vision</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl text-secondary mb-4">Notre mission</h3>
              <p className="text-gray-700">
                Livrer des solutions de construction métallique supérieures qui dépassent les attentes
                des clients grâce à un design innovant, un savoir-faire expert et un engagement constant
                envers la sécurité et la qualité.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <Eye className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl text-secondary mb-4">Notre vision</h3>
              <p className="text-gray-700">
                Devenir le choix de référence pour les projets de construction métallique dans le monde,
                reconnu pour notre excellence technique, nos pratiques durables et notre service client
                exceptionnel.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">Nos valeurs</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'Qualité', desc: 'L\'excellence dans chaque soudure, chaque poutre, chaque projet' },
              { title: 'Sécurité', desc: 'Engagement sans compromis envers la sécurité des équipes et des chantiers' },
              { title: 'Innovation', desc: 'Adoption des nouvelles technologies et méthodes' },
              { title: 'Intégrité', desc: 'Des relations honnêtes et transparentes avec toutes les parties' },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: `${stats.projects}+`, label: 'Projets réalisés' },
              { number: `${stats.clients}+`, label: 'Clients satisfaits' },
              { number: `${stats.team}+`, label: 'Membres de l\'équipe' },
              { number: `${stats.years}+`, label: 'Années d\'expérience' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-5xl mb-2">{stat.number}</div>
                <div className="text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
