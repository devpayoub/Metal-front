"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  Building2,
  Search,
  MapPin,
  Calendar,
} from "lucide-react";
import { api, type Project, type Category } from "@/lib/api-client";

type FormState = {
  title: string;
  description: string;
  location: string;
  year: string;
  category: string;
  cover_url: string;
  images: string[];
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  location: "",
  year: "",
  category: "",
  cover_url: "",
  images: [],
};

const CATEGORIES_FALLBACK = [
  "Structures Industrielles",
  "Fabrication Acier",
  "Portails & Clotures",
  "Escaliers",
  "Garde-corps",
  "Metallerie sur Mesure",
];

const FALLBACK = "https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image";

async function uploadFiles(files: File[]): Promise<string[]> {
  return api.uploadMany("/api/projects/upload", files);
}

function ProjectModal({
  initial,
  categories,
  onClose,
  onSaved,
}: {
  initial: Project | null;
  categories: string[];
  onClose: () => void;
  onSaved: (p: Project) => void;
}) {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          title: initial.title,
          description: initial.description || "",
          location: initial.location || "",
          year: initial.year ? String(initial.year) : "",
          category: initial.category || "",
          cover_url: initial.cover_url || "",
          images: Array.isArray(initial.images)
            ? (initial.images as unknown[]).filter((i): i is string => typeof i === "string")
            : [],
        }
      : EMPTY_FORM
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormState, v: string | string[]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await uploadFiles(Array.from(files));
      const newImages = [...form.images, ...urls];
      set("images", newImages);
      if (!form.cover_url && newImages.length > 0) set("cover_url", newImages[0]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    const next = form.images.filter((i) => i !== url);
    set("images", next);
    if (form.cover_url === url) set("cover_url", next[0] || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Le titre est requis"); return; }
    setSaving(true);
    try {
      const body = {
        title: form.title.trim(),
        description: form.description || null,
        location: form.location || null,
        year: form.year ? Number(form.year) : null,
        category: form.category || null,
        cover_url: form.cover_url || null,
        images: form.images,
      };
      let saved: Project;
      if (initial) {
        const d = await api.put<{ project: Project }>(`/api/projects/${initial.id}`, body);
        saved = d.project;
        toast.success("Projet mis a jour");
      } else {
        const d = await api.post<{ project: Project }>("/api/projects", body, true);
        saved = d.project;
        toast.success("Projet cree");
      }
      onSaved(saved);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl sm:rounded-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold text-secondary">
            {initial ? "Modifier le projet" : "Nouveau projet"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ex: Charpente Metallique - Entrepot"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ex: Tunis, Ariana..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annee</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                min={1990}
                max={2099}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Selectionner</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="Description detaillee du projet..."
              />
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <label className="text-sm font-medium text-gray-700">
                Galerie ({form.images.length} image(s))
              </label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-60"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? "Envoi..." : "Ajouter des images"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {form.images.length === 0 ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-primary hover:text-primary transition-colors"
              >
                <ImageIcon size={32} />
                <span className="text-sm">Cliquer pour ajouter des images</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {form.images.map((url) => (
                  <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => set("cover_url", url)}
                        title="Cover"
                        className={`p-1.5 rounded-full text-white text-xs ${form.cover_url === url ? "bg-primary" : "bg-black/60 hover:bg-primary"} transition-colors`}
                      >
                        Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="p-1.5 rounded-full bg-black/60 hover:bg-red-500 text-white transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    {form.cover_url === url && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-white hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {initial ? "Enregistrer" : "Creer le projet"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DeleteModal({ project, onClose, onDeleted }: { project: Project; onClose: () => void; onDeleted: (id: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/api/projects/${project.id}`);
      toast.success("Projet supprime");
      onDeleted(project.id);
    } catch (e) {
      toast.error((e as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md w-full"
      >
        <h3 className="text-lg font-bold text-secondary mb-2">Supprimer ce projet ?</h3>
        <p className="text-gray-600 text-sm mb-6">
          <span className="font-medium">{project.title}</span> sera definitivement supprime.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Supprimer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }: { project: Project; onEdit: () => void; onDelete: () => void }) {
  const images = Array.isArray(project.images)
    ? (project.images as unknown[]).filter((i): i is string => typeof i === "string")
    : [];
  const cover = project.cover_url || images[0] || FALLBACK;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={project.title} className="w-full h-full object-cover" />
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {images.length} photos
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-secondary truncate mb-1">{project.title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {project.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {project.location}
            </span>
          )}
          {project.year && (
            <span className="flex items-center gap-1">
              <Calendar size={11} /> {project.year}
            </span>
          )}
        </div>
        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary/5 hover:bg-secondary/10 text-secondary rounded-lg text-sm transition-colors"
          >
            <Pencil size={14} /> Modifier
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(CATEGORIES_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [projectsRes, catsRes] = await Promise.all([
        api.get<{ items: Project[] }>("/api/projects"),
        api.get<{ items: Category[] }>("/api/categories").catch(() => null),
      ]);
      setProjects(projectsRes.items || []);
      if (catsRes?.items?.length) setCategories(catsRes.items.map((c) => c.name));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (p: Project) => { setSelected(p); setModal("edit"); };
  const openDelete = (p: Project) => { setSelected(p); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSaved = (saved: Project) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      return idx >= 0
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
    });
    closeModal();
  };

  const handleDeleted = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    closeModal();
  };

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
              <Building2 size={24} className="text-primary" /> Projets
            </h1>
            <p className="text-gray-500 text-sm mt-1">{projects.length} projet(s) au total</p>
          </div>
          <button
            onClick={() => setModal("create")}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-medium shadow-sm"
          >
            <Plus size={18} /> Nouveau projet
          </button>
        </div>

        <div className="relative mb-6 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={36} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p>{search ? "Aucun projet ne correspond." : "Aucun projet pour l'instant."}</p>
            {!search && (
              <button
                onClick={() => setModal("create")}
                className="mt-4 text-primary hover:underline text-sm"
              >
                Creer le premier projet
              </button>
            )}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filtered.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onEdit={() => openEdit(p)}
                  onDelete={() => openDelete(p)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {(modal === "create" || modal === "edit") && (
          <ProjectModal
            initial={modal === "edit" ? selected : null}
            categories={categories}
            onClose={closeModal}
            onSaved={handleSaved}
          />
        )}
        {modal === "delete" && selected && (
          <DeleteModal
            project={selected}
            onClose={closeModal}
            onDeleted={handleDeleted}
          />
        )}
      </AnimatePresence>
    </>
  );
}
