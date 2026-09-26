"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Menu, X } from "lucide-react";

interface HeaderProps {
  onBookClick?: () => void;
}

export function Header({ onBookClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeNav, setActiveNav] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", hash: "#hero" },
    { name: "Services", href: "/services", hash: null },
    { name: "Promos", href: "/#promos", hash: "#promos" },
    { name: "Membership", href: "/membership", hash: null },
    { name: "Reviews", href: "/#feedback", hash: "#feedback" },
    { name: "Doctors", href: "/about", hash: null },
  ];

  // Smart Hide-on-Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      if (currentScrollY < 80) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Sync active with route
  useEffect(() => {
    if (pathname === "/about") setActiveNav("Doctors");
    else if (pathname === "/services") setActiveNav("Services");
    else if (pathname === "/membership") setActiveNav("Membership");
    else if (pathname === "/" && !window.location.hash) setActiveNav("Home");
  }, [pathname]);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof navItems)[0]
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveNav(item.name);
    if (!item.hash) {
      router.push(item.href);
      return;
    }
    if (pathname === "/") {
      document.getElementById(item.hash.replace("#", ""))?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(item.href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div
        className={`w-full transition-all duration-500 ${isScrolled
            ? "bg-[#C88F9A]/95 backdrop-blur-md shadow-lg shadow-[#C88F9A]/20"
            : "bg-[#C88F9A]"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <a
              href="/"
              onClick={(e) => handleNavigation(e, navItems[0])}
              className="flex items-center shrink-0 cursor-pointer group"
            >
              <Image
                src="/precious-md-rose-whilte-logo.png"
                alt="Precious MD Logo"
                width={140}
                height={42}
                priority
                className="w-auto h-8 sm:h-9 object-contain transition-opacity duration-200 group-hover:opacity-80"
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {navItems.map((item) => {
                const isActive = activeNav === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item)}
                    className={`relative text-white text-[13px] tracking-wide transition-all duration-200 cursor-pointer group ${isActive ? "font-semibold" : "font-normal opacity-85 hover:opacity-100"
                      }`}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-[1.5px] bg-white rounded-full transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                    />
                  </a>
                );
              })}
            </nav>

            {/* Right: Book Now button */}
            <div className="hidden lg:flex items-center">
              <button
                type="button"
                onClick={() => onBookClick?.()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#C88F9A] hover:bg-[#FAF8F5] text-xs font-semibold rounded-full transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Now
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-[#C88F9A]/95 backdrop-blur-md border-t border-white/20 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeNav === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item)}
                    className={`block px-4 py-3 rounded-xl text-white text-sm transition-all cursor-pointer ${isActive
                        ? "font-semibold bg-white/15"
                        : "font-normal hover:bg-white/10"
                      }`}
                  >
                    {item.name}
                  </a>
                );
              })}

              <div className="pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onBookClick?.(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#C88F9A] rounded-xl font-semibold text-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
