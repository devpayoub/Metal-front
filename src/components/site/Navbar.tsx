"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, LayoutDashboard, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();
  const { count: cartCount } = useCart();

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
    { path: "/shop", label: "Boutique" },
    { path: "/news", label: "Actualités" },
    { path: "/contact", label: "Contact" },
  ];

  const isHome = pathname === "/";
  const solid = isScrolled || !isHome;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? "bg-secondary shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center h-20 gap-4">
          <Link href="/" className="flex items-center justify-self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="MIS Metal Construction"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 justify-self-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-white hover:text-primary transition-colors ${
                  pathname === link.path ? "text-primary" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5 justify-self-end">
            <Link
              href="/cart"
              className="relative text-white hover:text-primary transition-colors"
              aria-label="Panier"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="bg-primary text-white px-5 py-2 rounded hover:brightness-110 transition flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} /> Admin
                  </Link>
                ) : (
                  <Link
                    href="/client"
                    className="bg-primary text-white px-5 py-2 rounded hover:brightness-110 transition"
                  >
                    Espace client
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  title="Déconnexion"
                  className="text-white/60 hover:text-white p-2"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-primary text-white px-6 py-2 rounded hover:brightness-110 transition flex items-center gap-2"
              >
                <LogIn size={16} /> Connexion
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4 justify-self-end">
            <Link href="/cart" className="relative text-white" aria-label="Panier">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-secondary border-t border-blue-900/40">
            <div className="flex flex-col py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-white hover:text-primary transition-colors px-4 ${
                    pathname === link.path ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link
                  href={isAdmin ? "/admin" : "/client"}
                  className="bg-primary text-white px-6 py-2 rounded hover:brightness-110 transition mx-4 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isAdmin ? "Admin" : "Espace client"}
                </Link>
              ) : (
                <Link
                  href="/auth"
                    className="bg-primary text-white px-6 py-2 rounded hover:brightness-110 transition mx-4 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
