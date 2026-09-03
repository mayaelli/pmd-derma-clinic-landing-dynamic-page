// src/config/clinicConfig.ts

export interface ServiceItem {
  name: string;
  desc: string;
  category?: string;
  image?: string;
  symptoms?: string[];
  includes?: string[];
  recovery?: string;
  warning?: string;
}

export interface ServicesConfig {
  hair: ServiceItem[];
  wound: ServiceItem[];
  aesthetic: ServiceItem[];
  specialized: ServiceItem[];
}

// Single source of truth for service categories
// key   → stored in DB (lowercase, no spaces)
// label → displayed in admin dropdown and client tabs
export const SERVICE_CATEGORIES: { key: string; label: string }[] = [
  { key: "hair", label: "Hair Care & Scalp" },
  { key: "wound", label: "Wound Care & Surgery" },
  { key: "aesthetic", label: "Facial & Aesthetic" },
  { key: "specialized", label: "Specialized & Wellness" },
];

export const clinicConfig = {
  name: "Precious MD Dermatology Center",
  doctor: "Dr. Precious, MD",
  credentials: "Board-Certified Dermatologist • PDS Accredited",
  phone: "0953 160 3724",
  email: "preciousmdclinic@gmail.com",
  address: "Ground Floor, JGC Building, Badelles Street, Poblacion, Iligan City, 9200",
  bookingUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_GOOGLE_CALENDAR_LINK",
  socials: {
    facebook: "https://facebook.com/PreciousMDDermatology",
    instagram: "https://instagram.com/preciousmddermatology",
  },
  stats: [
    { label: "Followers", value: "18K+" },
    { label: "Years of Expertise", value: "10+" },
    { label: "Board Certified", value: "PDS Member" },
  ],
  promos: [
    {
      id: "weekend-facial",
      title: "Weekend Facial Date with Friends",
      tag: "Group Special",
      description: "Deep cleansing, gentle extraction, medical mask, and soothing LED light therapy for you and your besties.",
      badge: "Save 15%",
    },
    {
      id: "acne-protocol",
      title: "Clear Skin Medical Acne Protocol",
      tag: "Clinical Care",
      description: "Comprehensive dermatological evaluation paired with active acne extraction and targeted recovery therapy.",
      badge: "Popular",
    },
  ],
  services: {
    hair: [
      {
        name: "Hair & Scalp PRP Therapy",
        desc: "Platelet-rich plasma injections to stimulate hair follicle growth and treat thinning hair.",
        recovery: "1–2 Days Mild Soreness",
      },
    ],
    wound: [
      {
        name: "Cellulitis & Bacterial Infection Care",
        desc: "Targeted medical assessment and antibiotic therapy to cure acute bacterial skin infections.",
        recovery: "7–10 Days Course",
        symptoms: [
          "Expanding redness & localized warmth",
          "Localized pain or skin tenderness",
          "Localized swelling & tissue tightness",
          "Abscesses, cysts, or bacterial lesions"
        ],
        includes: [
          "Direct clinical assessment by Dr. Precious Usman Imam",
          "Pathogen screening & culture swab sampling (if indicated)",
          "Custom targeted prescription (oral or topical antibiotics)",
          "Follow-up monitoring plan to prevent infection recurrence"
        ],
        warning: "If you are experiencing a high fever, systemic chills, or rapidly spreading red streaks along your skin, please seek immediate emergency department care."
      },
      {
        name: "Sclerotherapy for Varicose Veins",
        desc: "Targeted injectable therapy to diminish spider veins, varicose veins, and improve vascular appearance.",
        recovery: "3–5 Days Compression"
      },
      {
        name: "Jellyfish Sting & Toxin Relief",
        desc: "Immediate clinical intervention to neutralize marine stings, soothe skin, and prevent severe inflammation.",
        recovery: "Immediate Relief"
      },
    ],
    aesthetic: [
      { name: "Hydrafacial Experience", desc: "Deep exfoliation, pore vacuuming, and medical-grade serum hydration.", recovery: "Zero Downtime" },
      { name: "Deep Cleansing Facial", desc: "Manual extraction paired with soothing LED light recovery therapy.", recovery: "1 Day Mild Redness" },
      { name: "Microdermabrasion", desc: "Diamond-tip resurfacing to refine skin texture and overall tone.", recovery: "Zero Downtime" },
    ],
    specialized: [
      {
        name: "PreciousMD Lifting & Firming Protocol",
        desc: "Advanced non-invasive clinical therapy designed to tighten sagging skin and restore youthful facial contours.",
        recovery: "Minimal (1-2 Days)"
      },
      {
        name: "Medical Weight Management Program",
        desc: "Doctor-supervised weight loss regimens tailored to optimize metabolic health and achieve sustainable results.",
        recovery: "Ongoing Monthly"
      },
    ],
  } as ServicesConfig,
};