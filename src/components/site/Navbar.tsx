"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/about", label: "À propos" },
    { path: "/services", label: "Services" },
    { path: "/projects", label: "Projets" },
    { path: "/contact", label: "Contact" },
  ];

  const isHome = pathname === "/";
  const solid = isScrolled || !isHome;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-secondary/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="MIS Metal Construction"
              className="h-12 w-auto object-contain bg-white/95 rounded-md p-1.5"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-300 py-2 ${
                    isActive
                      ? "text-primary"
                      : "text-white/80 hover:text-primary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:brightness-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
            >
              Demander un devis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-secondary/95 backdrop-blur-md border-t border-white/10 rounded-b-2xl overflow-hidden">
            <div className="flex flex-col py-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-6 py-3.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-white/5"
                        : "text-white/80 hover:text-primary hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="px-6 pt-4">
                <Link
                  href="/contact"
                  className="block text-center bg-primary text-white text-sm font-medium px-6 py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
