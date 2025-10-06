/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors
        background: "#F7F7F8",
        card: "#FFFFFF",
        muted: "#F1F3F5",
        border: "#E5E7EB",
        // Text colors
        "text-primary": "#111827",
        "text-secondary": "#4B5563",
        "text-tertiary": "#6B7280",
        // Accent colors for content categories
        accent: {
          berita: "#C3A46B",
          galeri: "#E7B7A5",
          organisasi: "#6EC4B3",
          statistik: "#B7B7F0",
        },
        // NasDem Brand Colors
        brand: {
          primary: "#001B55",
          accent: "#FF9C04",
          success: "#53C22B",
          danger: "#C81E1E",
        },
      },
      borderRadius: {
        sm: "0.5rem", // 8px
        md: "0.75rem", // 12px
        lg: "1rem", // 16px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.06)",
        md: "0 4px 16px rgba(0,0,0,0.06)",
        lg: "0 8px 24px rgba(0,0,0,0.08)",
        xl: "0 12px 32px rgba(0,0,0,0.1)",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        md: ["1rem", { lineHeight: "1.5rem" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        xl: ["1.5rem", { lineHeight: "2rem" }], // 24px
        xxl: ["2rem", { lineHeight: "2.5rem" }], // 32px
        num: ["2.125rem", { lineHeight: "2.5rem" }], // 34px - for numbers
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      spacing: {
        4: "0.25rem", // 4px
        8: "0.5rem", // 8px
        12: "0.75rem", // 12px
        16: "1rem", // 16px
        20: "1.25rem", // 20px
        24: "1.5rem", // 24px
        32: "2rem", // 32px
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
