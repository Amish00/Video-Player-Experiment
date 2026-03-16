/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        void: "#080A0F",
        surface: "#0E1117",
        panel: "#141820",
        border: "#1E2530",
        accent: "#E8FF47",
        "accent-dim": "#C8DF2A",
        muted: "#4A5568",
        ghost: "#2D3748",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseRing: { "0%,100%": { transform: "scale(1)", opacity: "0.6" }, "50%": { transform: "scale(1.15)", opacity: "0" } },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease forwards",
        slideUp: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        pulseRing: "pulseRing 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

