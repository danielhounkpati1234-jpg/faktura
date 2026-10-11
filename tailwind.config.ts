import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          50: "rgb(var(--gray-50) / <alpha-value>)",
          100: "rgb(var(--gray-100) / <alpha-value>)",
          200: "rgb(var(--gray-200) / <alpha-value>)",
        },
        brand: {
          50: "var(--color-brand-50)",
          100: "#D4E8E4",
          200: "#A8D1C9",
          300: "#6DB5A8",
          400: "#3D9B8C",
          500: "#1A7A6D",
          600: "#146358",
          700: "#104E46",
          800: "#0C3B34",
          900: "#082822",
        },
        card: "rgb(var(--color-card) / <alpha-value>)",
        page: "rgb(var(--color-page) / <alpha-value>)",
        sidebar: {
          bg: "rgb(var(--color-sidebar-bg) / <alpha-value>)",
          hover: "rgb(var(--color-sidebar-hover) / <alpha-value>)",
          active: "rgb(var(--color-sidebar-active) / <alpha-value>)",
          border: "var(--color-sidebar-border)",
        },
        heading: "var(--color-heading)",
        body: "var(--color-body)",
        muted: "var(--color-muted)",
        status: {
          paid: "#16A34A",
          "paid-bg": "var(--color-status-paid-bg)",
          sent: "#EA580C",
          "sent-bg": "var(--color-status-sent-bg)",
          draft: "#6B7280",
          "draft-bg": "var(--color-status-draft-bg)",
          overdue: "#DC2626",
          "overdue-bg": "var(--color-status-overdue-bg)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        soft: "var(--shadow-soft)",
      },
    },
  },
  plugins: [],
};
export default config;
