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
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C87D87]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#FAF7F2]/15">
          
          {/* Column 1: Brand & Inspirational Quote */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2]/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#E5BCA9]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Precious MD Dermatology
              </span>
            </div>

            <p className="text-xs text-[#FAF7F2]/80 font-light leading-relaxed pr-4">
              Providing medical, surgical, and aesthetic skin care personally directed by a board-certified dermatologist.
            </p>

            {/* Inspirational Quote Card */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2]/5 border border-[#FAF7F2]/10 space-y-1">
              <p className="font-serif italic text-xs text-[#E5BCA9]">
                "Healthy skin is a reflection of overall wellness, cared for with science and intent."
              </p>
              <p className="text-[10px] text-[#FAF7F2]/60 font-medium">
                — Dr. Precious
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-light text-[#FAF7F2]/80">
              <li>
                <a href="#services" className="hover:text-[#E5BCA9] transition-colors">
                  Clinical Services
                </a>
              </li>
              <li>
                <a href="#promos" className="hover:text-[#E5BCA9] transition-colors">
                  Summer Promos
                </a>
              </li>
              <li>
                <a href="#feedback" className="hover:text-[#E5BCA9] transition-colors">
                  Patient Reviews
                </a>
              </li>
              <li>
                <a href="#about-doctor" className="hover:text-[#E5BCA9] transition-colors">
                  Doctor Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinic Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide">
              Clinic Hours
            </h4>
            <div className="space-y-2 text-xs font-light text-[#FAF7F2]/80">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#E5BCA9] shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white">Monday – Saturday</div>
                  <div className="text-[11px] text-[#FAF7F2]/60">9:00 AM – 5:00 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#C87D87]/30 text-[#E5BCA9] text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <div>
                  <div className="font-medium text-white">Sunday & Holidays</div>
                  <div className="text-[11px] text-[#FAF7F2]/60">By Prior Appointment Only</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Location & Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide">
              Contact & Location
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-[#FAF7F2]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5BCA9] shrink-0 mt-0.5" />
                <span>
                  Ground Floor, JGC Building, Badelles St., Corner Lluch St., Iligan City, 9200
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#E5BCA9] shrink-0" />
                <a href="tel:+639531603724" className="hover:text-[#E5BCA9] transition-colors">
                  +63 (953) 160 3724
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#E5BCA9] shrink-0" />
                <a href="mailto:preciousmdclinic@gmail.com" className="hover:text-[#E5BCA9] transition-colors">
                  preciousmdclinic@gmail.com
                </a>
              </li>
            </ul>

            {/* Social Links using custom SVG Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.facebook.com/preciousmdclinic"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FAF7F2]/10 hover:bg-[#C87D87] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook Page"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/preciousmddermatology"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FAF7F2]/10 hover:bg-[#C87D87] text-white flex items-center justify-center transition-colors"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-light text-[#FAF7F2]/60">
          <div>
            © {new Date().getFullYear()} Precious MD Dermatology Clinic. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with care for healthier skin</span>
            <Heart className="w-3 h-3 text-[#C87D87] fill-[#C87D87]" />
          </div>
        </div>

      </div>
    </footer>
  );
}