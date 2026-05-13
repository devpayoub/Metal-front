"use client";

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { X, ZoomIn, Calendar, MapPin, Loader2 } from 'lucide-react';
import { api, type Project as ApiProject } from '@/lib/api-client';

type UiProject = {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  date: string;
  description: string;
};

const mapProject = (p: ApiProject): UiProject => ({
  id: p.id,
  title: p.title,
  category: 'Tous',
  image: p.cover_url || 'https://placehold.co/800x500?text=Aucune+image',
  location: p.location || '—',
  date: p.year ? String(p.year) : new Date(p.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
  description: p.description || '',
});

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState<UiProject | null>(null);
  const [projects, setProjects] = useState<UiProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ items: ApiProject[] }>('/api/projects')
      .then((d) => setProjects(d.items.map(mapProject)))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Tous'];


  const filteredProjects = activeCategory === 'Tous'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-to-br from-secondary via-[#1a1a1a] to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
              Nos <span className="text-primary">Projets</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              L&apos;excellence en construction métallique au service de tous les secteurs
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white sticky top-20 z-40 border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                  Aucun projet pour le moment — revenez bientôt.
                </div>
              ) : (
              <div className="columns-1 gap-x-6 space-y-6 sm:columns-2 xl:columns-3">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group break-inside-avoid-column mb-6"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-auto"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                        >
                          <ZoomIn className="text-white" size={28} />
                        </motion.div>
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-6 text-white w-full">
                          <div className="text-sm text-primary mb-2">{project.category}</div>
                          <h3 className="text-xl mb-2">{project.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{project.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-primary mb-2">{project.category}</div>
                      <h3 className="text-xl text-secondary mb-3">{project.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{project.date}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-xl max-w-4xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-96 object-cover" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
                >
                  <X className="text-secondary" size={24} />
                </button>
              </div>
              <div className="p-8">
                <div className="text-sm text-primary mb-2">{selectedProject.category}</div>
                <h2 className="text-3xl text-secondary mb-4">{selectedProject.title}</h2>
                <div className="flex items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    <span>{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    <span>{selectedProject.date}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-lg">{selectedProject.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-6">Prêt à discuter de votre projet ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Donnons vie à votre vision avec nos services experts en construction métallique
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-100 transition-all"
            >
              Démarrer mon projet
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
