"use client";

import { motion, AnimatePresence, useInView } from 'motion/react';
import { useState, useRef } from 'react';
import {
  Mail, Phone, MapPin, Clock, Send, ChevronRight, ChevronLeft,
  User, Building2, MessageSquare, CheckCircle2, ArrowRight,
  ChevronDown, Zap, Shield, Star, Headphones
} from 'lucide-react';

// ── Floating Label Input ────────────────────────────────────────────────────
interface FloatInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
}

function FloatInput({ id, name, type = 'text', label, value, onChange, required, icon }: FloatInputProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative group">
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${active ? 'bg-gradient-to-r from-primary/10 to-orange-500/5' : 'bg-transparent'}`} />
      <div className={`relative flex items-center border-2 rounded-xl transition-all duration-300 bg-white ${focused ? 'border-primary shadow-[0_0_0_4px_rgba(255,107,0,0.12)]' : 'border-gray-200 hover:border-gray-300'}`}>
        {icon && (
          <div className={`pl-4 transition-colors duration-300 ${focused ? 'text-primary' : 'text-gray-400'}`}>
            {icon}
          </div>
        )}
        <div className="relative flex-1">
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            className="w-full px-4 py-5 pt-7 pb-3 bg-transparent text-secondary outline-none text-base"
          />
          <motion.label
            htmlFor={id}
            animate={active ? { y: -10, scale: 0.78, color: focused ? '#FF6B00' : '#6B6B6B' } : { y: 0, scale: 1, color: '#9ca3af' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 origin-left pointer-events-none font-medium"
            style={{ fontSize: '0.95rem' }}
          >
            {label}{required && ' *'}
          </motion.label>
        </div>
      </div>
    </div>
  );
}

// ── Floating Label Textarea ─────────────────────────────────────────────────
interface FloatTextareaProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}

function FloatTextarea({ id, name, label, value, onChange, required, rows = 5 }: FloatTextareaProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <div className={`relative border-2 rounded-xl transition-all duration-300 bg-white ${focused ? 'border-primary shadow-[0_0_0_4px_rgba(255,107,0,0.12)]' : 'border-gray-200 hover:border-gray-300'}`}>
        <div className="relative px-4 pt-6 pb-3">
          <motion.label
            htmlFor={id}
            animate={active ? { y: 0, scale: 0.78, color: focused ? '#FF6B00' : '#6B6B6B' } : { y: 12, scale: 1, color: '#9ca3af' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-4 top-3 origin-left pointer-events-none font-medium"
            style={{ fontSize: '0.95rem' }}
          >
            {label}{required && ' *'}
          </motion.label>
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            rows={rows}
            className="w-full bg-transparent text-secondary outline-none resize-none text-base mt-2"
          />
        </div>
      </div>
    </div>
  );
}

// ── Step Indicator ──────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Vos infos', icon: User },
  { label: 'Société', icon: Building2 },
  { label: 'Message', icon: MessageSquare },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-10 relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
        <motion.div
          className="h-full bg-primary origin-left"
          animate={{ scaleX: current / (STEPS.length - 1) }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex flex-col items-center z-10 gap-2">
            <motion.div
              animate={{
                backgroundColor: done || active ? '#FF6B00' : '#fff',
                borderColor: done || active ? '#FF6B00' : '#d1d5db',
                scale: active ? 1.15 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
            >
              {done ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <CheckCircle2 size={18} className="text-white" />
                </motion.div>
              ) : (
                <Icon size={16} className={active ? 'text-white' : 'text-gray-400'} />
              )}
            </motion.div>
            <span className={`text-xs font-medium transition-colors duration-300 ${active ? 'text-primary' : done ? 'text-gray-500' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Service Type Selector ───────────────────────────────────────────────────
const SERVICE_TYPES = ['Structures en acier', 'Couverture métallique', 'Bâtiments industriels', 'Fabrication sur mesure', 'Rénovation', 'Consultation'];

function ServiceSelector({ selected, onToggle }: { selected: string[]; onToggle: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SERVICE_TYPES.map((s) => {
        const on = selected.includes(s);
        return (
          <motion.button
            key={s}
            type="button"
            onClick={() => onToggle(s)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={{ backgroundColor: on ? '#FF6B00' : '#fff', color: on ? '#fff' : '#2B2B2B', borderColor: on ? '#FF6B00' : '#e5e7eb' }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 rounded-full border text-sm font-medium cursor-pointer"
          >
            {s}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Success Screen ──────────────────────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
        className="relative mb-8"
      >
        <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-white" />
            </div>
          </div>
        </div>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: Math.cos((i * 45 * Math.PI) / 180) * 60, y: Math.sin((i * 45 * Math.PI) / 180) * 60 }}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.8 }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"
          />
        ))}
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl text-secondary mb-3"
      >
        Message envoyé !
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 max-w-xs mb-8"
      >
        Merci de nous avoir contactés. Notre équipe vous répondra sous 24 heures.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={onReset}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="px-8 py-3 bg-primary text-white rounded-xl font-medium"
      >
        Envoyer un autre message
      </motion.button>
    </motion.div>
  );
}

// ── FAQ Item ────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Quels sont vos délais habituels ?', a: 'Les délais varient selon la portée et la complexité. La plupart des projets durent entre 4 et 12 semaines de la validation du design à la livraison, incluant la fabrication et l\'installation.' },
  { q: 'Proposez-vous des devis gratuits ?', a: 'Absolument. Nous offrons des consultations initiales et des devis écrits détaillés gratuits, sans engagement.' },
  { q: 'Quelles zones couvrez-vous ?', a: 'Nous couvrons principalement le territoire national mais pouvons prendre en charge des projets de grande envergure régionaux et internationaux sur demande.' },
  { q: 'Quelles certifications détient MIS Metal ?', a: 'MIS Metal Construction est certifiée ISO 9001 et détient toutes les licences professionnelles et certifications de sécurité requises par les normes nationales.' },
  { q: 'Gérez-vous à la fois la conception et la construction ?', a: 'Oui — nous proposons un service clé en main complet : ingénierie structurelle, design, fabrication, livraison et installation.' },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08 }}
      className="border border-gray-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="text-secondary font-medium pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0 text-primary">
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-500 border-t border-gray-100 pt-4">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Contact Info Card ───────────────────────────────────────────────────────
function InfoCard({ icon: Icon, title, lines, index }: { icon: React.ElementType; title: string; lines: string[]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(255,107,0,0.12)' }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-default"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
        <Icon size={22} className="text-primary" />
      </div>
      <h3 className="text-secondary mb-2 font-medium">{title}</h3>
      {lines.map((l, i) => <p key={i} className="text-gray-500 text-sm leading-relaxed">{l}</p>)}
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export function ContactPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    company: '', position: '',
    services: [] as string[],
    budget: '', message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleService = (s: string) =>
    setFormData(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }));

  const nextStep = () => { setDirection(1); setStep(s => s + 1); };
  const prevStep = () => { setDirection(-1); setStep(s => s - 1); };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const reset = () => {
    setSubmitted(false);
    setStep(0);
    setFormData({ name: '', email: '', phone: '', company: '', position: '', services: [], budget: '', message: '' });
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  const INFO_CARDS = [
    { icon: MapPin, title: 'Notre adresse', lines: ['ZI Beni Khiar 8060', 'Tunisie'] },
    {
      icon: Phone,
      title: 'Téléphones',
      lines: ['+216 31 402 151', '+216 52 448 549', '+216 24 088 087', 'Fax : +216 32 402 151'],
    },
    {
      icon: Mail,
      title: 'Adresses email',
      lines: ['mbs.metalconstruction@gmail.com', 'medsalah.mbs@gmail.com'],
    },
    { icon: Clock, title: "Horaires d'ouverture", lines: ['Lun–Ven : 8h00 – 18h00', 'Samedi : 9h00 – 14h00'] },
  ];

  const FEATURES = [
    { icon: Zap, label: 'Réponse rapide', desc: 'Sous 24 heures' },
    { icon: Shield, label: 'Confidentialité', desc: 'Vos données sont protégées' },
    { icon: Star, label: 'Équipe experte', desc: '20+ ans d\'expérience' },
    { icon: Headphones, label: 'Support 24/7', desc: 'Pour les urgences' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">

      {/* ── Hero (unified style) ── */}
      <section className="relative bg-gradient-to-br from-secondary via-[#0a1029] to-secondary text-white py-24 overflow-hidden">
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* animated gradient orbs */}
        {[
          { size: 400, x: '10%', y: '-20%', delay: 0 },
          { size: 500, x: '70%', y: '40%', delay: 1.5 },
          { size: 300, x: '40%', y: '60%', delay: 0.8 },
        ].map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/15 blur-3xl pointer-events-none"
            style={{ width: o.size, height: o.size, left: o.x, top: o.y }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, delay: o.delay, ease: 'easeInOut' }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Mail size={14} /> Contactez-nous
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl mb-6 tracking-tight font-bold"
          >
            Construisons
            <br />
            <span className="text-primary">ensemble</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Contactez notre équipe d&apos;experts pour des devis, des consultations ou toute question sur votre projet de construction métallique.
          </motion.p>

          {/* feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                  <Icon size={14} className="text-primary" />
                  <span className="text-sm text-gray-300">{f.label}</span>
                  <span className="text-xs text-gray-500">· {f.desc}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12" style={{ fill: '#f9fafb' }}>
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INFO_CARDS.map((c, i) => <InfoCard key={i} {...c} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="py-8 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8 md:p-10"
            >
              {submitted ? (
                <SuccessScreen onReset={reset} />
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl text-secondary mb-2">Envoyez-nous un message</h2>
                    <p className="text-gray-400 text-sm">Remplissez le formulaire et nous répondrons sous 24 heures.</p>
                  </div>

                  <StepIndicator current={step} />

                  <form onSubmit={handleSubmit}>
                    <div className="relative overflow-hidden min-h-[320px]">
                      <AnimatePresence custom={direction} mode="wait">
                        {/* Step 0 – Personal Info */}
                        {step === 0 && (
                          <motion.div
                            key="step0"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="space-y-5"
                          >
                            <FloatInput id="name" name="name" label="Nom complet" value={formData.name} onChange={handleChange} required icon={<User size={18} />} />
                            <FloatInput id="email" name="email" type="email" label="Adresse email" value={formData.email} onChange={handleChange} required icon={<Mail size={18} />} />
                            <FloatInput id="phone" name="phone" type="tel" label="Téléphone" value={formData.phone} onChange={handleChange} icon={<Phone size={18} />} />
                          </motion.div>
                        )}

                        {/* Step 1 – Company Info */}
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="space-y-5"
                          >
                            <FloatInput id="company" name="company" label="Nom de l'entreprise" value={formData.company} onChange={handleChange} icon={<Building2 size={18} />} />
                            <FloatInput id="position" name="position" label="Votre fonction" value={formData.position} onChange={handleChange} icon={<User size={18} />} />
                            <div>
                              <p className="text-sm text-gray-500 mb-3 font-medium">Services souhaités</p>
                              <ServiceSelector selected={formData.services} onToggle={toggleService} />
                            </div>
                          </motion.div>
                        )}

                        {/* Step 2 – Message */}
                        {step === 2 && (
                          <motion.div
                            key="step2"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="space-y-5"
                          >
                            <FloatInput id="budget" name="budget" label="Budget estimé (optionnel)" value={formData.budget} onChange={handleChange} icon={<ArrowRight size={18} />} />
                            <FloatTextarea id="message" name="message" label="Parlez-nous de votre projet" value={formData.message} onChange={handleChange} required rows={5} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 gap-4">
                      <AnimatePresence>
                        {step > 0 && (
                          <motion.button
                            type="button"
                            onClick={prevStep}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-6 py-3.5 border-2 border-gray-200 text-secondary rounded-xl hover:border-primary hover:text-primary transition-colors duration-200 font-medium"
                          >
                            <ChevronLeft size={18} /> Retour
                          </motion.button>
                        )}
                      </AnimatePresence>

                      <motion.button
                        type={step === STEPS.length - 1 ? 'submit' : 'button'}
                        onClick={step < STEPS.length - 1 ? nextStep : undefined}
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(255,107,0,0.35)' }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-medium transition-all duration-200 ml-auto"
                        style={{ maxWidth: step === 0 ? '100%' : undefined }}
                      >
                        {step === STEPS.length - 1 ? (
                          <><Send size={18} /> Envoyer</>
                        ) : (
                          <>Continuer <ChevronRight size={18} /></>
                        )}
                      </motion.button>
                    </div>

                    {/* Progress text */}
                    <p className="text-center text-xs text-gray-400 mt-4">
                      Étape {step + 1} sur {STEPS.length}
                    </p>
                  </form>
                </>
              )}
            </motion.div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 h-64"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.681138852437!2d-73.98784668459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                />
              </motion.div>

              {/* Emergency Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="relative bg-[#0D1B4B] rounded-3xl p-6 overflow-hidden"
              >
                <motion.div
                  className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <Headphones size={28} className="text-primary mb-4 relative z-10" />
                <h3 className="text-white mb-1 relative z-10">Support d&apos;urgence</h3>
                <p className="text-gray-400 text-sm mb-4 relative z-10">Pour les urgences — disponible 24/7 pour les clients existants.</p>
                <a
                  href="tel:+21624088087"
                  className="text-primary text-2xl font-medium relative z-10 hover:underline"
                >
                  +216 24 088 087
                </a>
              </motion.div>

              {/* Social quick links */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
              >
                <h3 className="text-secondary mb-4 font-medium">Suivez-nous</h3>
                <div className="flex gap-3 flex-wrap">
                  {['LinkedIn', 'Facebook', 'Instagram', 'YouTube'].map((platform, i) => (
                    <motion.a
                      key={platform}
                      href="#"
                      whileHover={{ scale: 1.06, backgroundColor: '#FF6B00', color: '#fff' }}
                      transition={{ duration: 0.2 }}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium"
                    >
                      {platform}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">FAQ</span>
            <h2 className="text-4xl md:text-5xl text-secondary mb-4 font-bold">Questions fréquentes</h2>
            <p className="text-gray-500 text-lg">Tout ce qu&apos;il faut savoir avant de commencer.</p>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((f, i) => <FaqItem key={i} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="text-white text-center md:text-left">
              <h2 className="text-3xl mb-2">Prêt à démarrer votre projet ?</h2>
              <p className="text-white/80">Notre équipe est prête à donner vie à votre vision.</p>
            </div>
            <motion.a
              href="tel:+21631402151"
              whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#FF6B00' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-medium backdrop-blur-sm transition-colors duration-300 flex-shrink-0"
            >
              <Phone size={20} />
              Appelez-nous
              <ArrowRight size={18} />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
