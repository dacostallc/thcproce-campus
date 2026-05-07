import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canna: {
          50: "#f0fdf4",
          100: "#dcfce7",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d"
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706"
        },
        ink: {
          900: "#08110a",
          800: "#0d1a10",
          700: "#13241a",
          600: "#1d3328"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(74,222,128,0.6)" },
          "50%": { boxShadow: "0 0 36px 12px rgba(74,222,128,0.0)" }
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        droneFly: {
          "0%": { transform: "translate3d(-10vw,0,0)" },
          "100%": { transform: "translate3d(110vw,0,0)" }
        },
        droneFly2: {
          "0%": { transform: "translate3d(110vw,0,0)" },
          "100%": { transform: "translate3d(-10vw,0,0)" }
        },
        firefly: {
          "0%, 100%": { opacity: "0", transform: "translate(0,0) scale(0.6)" },
          "20%": { opacity: "1" },
          "50%": { transform: "translate(20px,-30px) scale(1)" },
          "80%": { opacity: "1" }
        },
        windowFlicker: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" }
        },
        carPass: {
          "0%": { transform: "translateX(-15vw)" },
          "100%": { transform: "translateX(115vw)" }
        },
        zoomIn: {
          "0%": { transform: "scale(1.15)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        floatY: "floatY 4s ease-in-out infinite",
        droneFly: "droneFly 22s linear infinite",
        droneFly2: "droneFly2 28s linear infinite",
        firefly: "firefly 5s ease-in-out infinite",
        windowFlicker: "windowFlicker 3s ease-in-out infinite",
        carPass: "carPass 14s linear infinite",
        zoomIn: "zoomIn 1.6s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
