"use client";

import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  Heart 
} from "lucide-react";

// Native SVG for Facebook
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// Native SVG for Instagram
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#333D29] text-[#FAF7F2] relative overflow-hidden font-sans">
      
      {/* Decorative Accent Glow */}
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#C87D87]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-10 sm:pb-12 border-b border-[#FAF7F2]/15">
          
          {/* Column 1: Brand & Inspirational Quote */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2]/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#E5BCA9]" />
              </div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                Precious MD Dermatology
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 font-light leading-relaxed max-w-prose">
              Providing medical, surgical, and aesthetic skin care personally directed by a board-certified dermatologist.
            </p>

            {/* Inspirational Quote Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2]/5 border border-[#FAF7F2]/10 space-y-1 max-w-sm">
              <p className="font-serif italic text-xs sm:text-sm text-[#E5BCA9] leading-snug">
                "Healthy skin is a reflection of overall wellness, cared for with science and intent."
              </p>
              <p className="text-[10px] sm:text-xs text-[#FAF7F2]/60 font-medium">
                — Dr. Precious
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links Navigation */}
          <div className="sm:col-span-1 lg:col-span-2 space-y-3">
            <h4 className="font-serif text-xs sm:text-sm font-bold text-white tracking-wider uppercase sm:normal-case">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light text-[#FAF7F2]/80">
              <li>
                <a href="#services" className="hover:text-[#E5BCA9] transition-colors inline-block py-1 sm:py-0">
                  Clinical Services
                </a>
              </li>
              <li>
                <a href="#promos" className="hover:text-[#E5BCA9] transition-colors inline-block py-1 sm:py-0">
                  Special Promos
                </a>
              </li>
              <li>
                <a href="#feedback" className="hover:text-[#E5BCA9] transition-colors inline-block py-1 sm:py-0">
                  Patient Reviews
                </a>
              </li>
              <li>
                <a href="#about-doctor" className="hover:text-[#E5BCA9] transition-colors inline-block py-1 sm:py-0">
                  Doctor Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinic Hours */}
          <div className="sm:col-span-1 lg:col-span-3 space-y-3">
            <h4 className="font-serif text-xs sm:text-sm font-bold text-white tracking-wider uppercase sm:normal-case">
              Clinic Hours
            </h4>
            <div className="space-y-3 text-xs sm:text-sm font-light text-[#FAF7F2]/80">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E5BCA9] shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white">Monday – Saturday</div>
                  <div className="text-xs text-[#FAF7F2]/60 mt-0.5">9:00 AM – 5:00 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#C87D87]/30 text-[#E5BCA9] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <div>
                  <div className="font-medium text-white">Sunday & Holidays</div>
                  <div className="text-xs text-[#FAF7F2]/60 mt-0.5">By Prior Appointment Only</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Location & Contact Details */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-3">
            <h4 className="font-serif text-xs sm:text-sm font-bold text-white tracking-wider uppercase sm:normal-case">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-light text-[#FAF7F2]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5BCA9] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Ground Floor, JGC Building, Badelles St., Corner Lluch St., Iligan City, 9200
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5BCA9] shrink-0" />
                <a href="tel:+639531603724" className="hover:text-[#E5BCA9] transition-colors py-0.5">
                  +63 (953) 160 3724
                </a>
              </li>
              <li className="flex items-center gap-2.5 break-all sm:break-normal">
                <Mail className="w-4 h-4 text-[#E5BCA9] shrink-0" />
                <a href="mailto:preciousmdclinic@gmail.com" className="hover:text-[#E5BCA9] transition-colors py-0.5">
                  preciousmdclinic@gmail.com
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.facebook.com/preciousmdclinic"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#FAF7F2]/10 hover:bg-[#C87D87] text-white flex items-center justify-center transition-colors touch-manipulation"
                aria-label="Facebook Page"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/preciousmddermatology"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#FAF7F2]/10 hover:bg-[#C87D87] text-white flex items-center justify-center transition-colors touch-manipulation"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Credit */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] sm:text-xs font-light text-[#FAF7F2]/60">
          <div>
            © {new Date().getFullYear()} Precious MD Dermatology Clinic. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Crafted with care for healthier skin</span>
            <Heart className="w-3.5 h-3.5 text-[#C87D87] fill-[#C87D87]" />
          </div>
        </div>

      </div>
    </footer>
  );
}