import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        brand: {
          // Primary / Dominant — main brand CTA color
          "flush-pink": "#E48EAB",
          "flush-pink-hover": "#D4778E",
          // Secondary / Soft Accent — section backgrounds, pill fills
          "dewy-rose": "#F8BFC5",
          // Grounding / Professional Accent — footer, muted text, borders
          slate: "#908A94",
          "slate-dark": "#BABBBF",
          // Warm Accent — icon accents, credential highlights
          taupe: "#CD9581",
          // Neutral Base
          white: "#FFFFFF",
          mist: "#E3E4E8",
        },
      },
    },
  },
  plugins: [],
};
export default config;