"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Menu, X } from "lucide-react";

interface HeaderProps {
  onBookClick?: () => void;
}

export function Header({ onBookClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "Services", href: "#services" },
    { name: "Promos", href: "#promos" },
    { name: "Feedbacks", href: "#feedback" },
    { name: "Doctor", href: "#about-doctor" },
  ];

  // 1. Detect scroll depth
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Automatically update active link on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          const matchedItem = navItems.find((item) => item.href === `#${id}`);
          if (matchedItem) {
            setActiveNav(matchedItem.name);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    navItems.forEach((item) => {
      const targetId = item.href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // 3. Mobile-Optimized Smooth Scroll Handler
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    name: string
  ) => {
    e.preventDefault();
    if (name) setActiveNav(name);
    
    // Close mobile dropdown menu immediately
    setMobileMenuOpen(false);

    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Use setTimeout so the DOM re-renders after closing the mobile drawer
      setTimeout(() => {
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#E5BCA9]/30 shadow-xs h-16"
          : "bg-[#FAF7F2]/80 backdrop-blur-xs border-b border-[#E5BCA9]/20 h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-50">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, "#hero", "Home")}
          className="flex items-center gap-3 transition-transform active:scale-95 shrink-0 cursor-pointer"
        >
          <Image
            src="/precious-md-logo.png"
            alt="Precious MD Dermatology Logo"
            width={250}
            height={180}
            priority
            className={`w-auto object-contain transition-all duration-300 ${
              isScrolled ? "h-9" : "h-11 sm:h-12"
            }`}
          />
        </a>

        {/* Desktop Links (Hidden on Mobile/Tablet) */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeNav === item.name;

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href, item.name)}
                className={`relative px-3 py-2 text-xs font-sans font-medium transition-colors duration-200 flex items-center gap-1.5 select-none cursor-pointer ${
                  isActive
                    ? "text-[#C87D87] font-semibold"
                    : "text-[#333D29] hover:text-[#C87D87]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C87D87] rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              onBookClick?.();
            }}
            className="relative inline-flex items-center gap-2 bg-[#6B7556] hover:bg-[#586146] text-white font-sans text-xs font-semibold px-4 py-2 rounded-lg shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FBEAD6]" />
            <span>Book Slot</span>
          </a>

          {/* Hamburger Icon */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 text-[#333D29] hover:text-[#C87D87] focus:outline-none cursor-pointer relative z-50"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden relative z-50 pointer-events-auto bg-white border-b border-[#E5BCA9]/30 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-5 space-y-2">
              {navItems.map((item) => {
                const isActive = activeNav === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href, item.name)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#FAF7F2] text-[#C87D87] font-semibold"
                        : "text-[#333D29] active:bg-[#FAF7F2] active:text-[#C87D87]"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}