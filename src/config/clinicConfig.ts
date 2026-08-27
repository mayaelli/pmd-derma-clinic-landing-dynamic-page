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
  medical: ServiceItem[];
  aesthetic: ServiceItem[];
  specialty: ServiceItem[];
}

export const clinicConfig = {
  name: "Precious MD Dermatology Center",
  doctor: "Dr. Precious, MD",
  credentials: "Board-Certified Dermatologist • PDS Accredited",
  phone: "0953 160 3724",
  email: "preciousmdclinic@gmail.com",
  address: "Ground Floor, JGC Building, Badelles Street, Poblacion, Iligan City, 9200",
  bookingUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_GOOGLE_CALENDAR_LINK", // Your main Google Calendar link
  socials: {
    facebook: "https://facebook.com/PreciousMDDermatology",
    instagram: "https://instagram.com/preciousmddermatology",
  },
  stats: [
    { label: "Followers", value: "18K+" },
    { label: "Reel Views", value: "2.1M+" },
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
    medical: [
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
      { 
        name: "Lentigo & Solar Pigmentation Treatment", 
        desc: "Precision clinical care targeting sunspots, age spots, and localized hyperpigmentation.",
        recovery: "5–7 Days Flaking"
      },
      { 
        name: "Sebaceous Hyperplasia & Mild Acne Care", 
        desc: "Customized dermatological regimens to clear enlarged oil glands, bumps, and mild acne breakouts.",
        recovery: "1–3 Days Redness"
      },
    ],
    aesthetic: [
      { name: "Hydrafacial Experience", desc: "Deep exfoliation, pore vacuuming, and medical-grade serum hydration.", recovery: "Zero Downtime" },
      { name: "Deep Cleansing Facial", desc: "Manual extraction paired with soothing LED light recovery therapy.", recovery: "1 Day Mild Redness" },
      { name: "Microdermabrasion", desc: "Diamond-tip resurfacing to refine skin texture and overall tone.", recovery: "Zero Downtime" },
    ],
    specialty: [
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
      { 
        name: "Psoriasis & Chronic Skin Care", 
        desc: "Comprehensive dermatological management to soothe inflammation, control flare-ups, and restore skin barrier health.",
        recovery: "Long-term Care"
      },
    ],
  } as ServicesConfig,
};