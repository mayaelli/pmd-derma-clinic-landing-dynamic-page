"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface HeaderProps {
  onBookClick?: () => void;
}

export function Header({ onBookClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");

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

  // 3. Smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
    e.preventDefault();
    if (name) setActiveNav(name);

    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, "#hero", "Home")}
          className="flex items-center gap-3 transition-transform active:scale-95 shrink-0"
        >
          <Image
            src="/precious-md-logo.png"
            alt="Precious MD Dermatology Logo"
            width={250}
            height={180}
            priority
            className={`w-auto object-contain transition-all duration-300 ${
              isScrolled ? "h-9" : "h-12"
            }`}
          />
        </a>

        {/* Dynamic Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeNav === item.name;

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href, item.name)}
                className={`relative px-3 py-2 text-xs font-sans font-medium transition-colors duration-200 flex items-center gap-1.5 select-none ${
                  isActive
                    ? "text-[#C87D87] font-semibold"
                    : "text-[#333D29] hover:text-[#C87D87]"
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C87D87] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* CTA Button */}
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
          </div>

      </div>
    </header>
  );
}