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
          "0%": { transform: "translate3d(-18%,0,0)" },
          "100%": { transform: "translate3d(118%,0,0)" }
        },
        droneFly2: {
          "0%": { transform: "translate3d(118%,0,0)" },
          "100%": { transform: "translate3d(-18%,0,0)" }
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
          "0%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(120%)" }
        },
        zoomIn: {
          "0%": { transform: "scale(1.15)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        /** Idle sway for campus map player figurine (respect `motion-reduce:animate-none`). */
        campusPlayerIdle: {
          "0%, 100%": { transform: "translateY(0) rotate(-1.35deg)" },
          "50%": { transform: "translateY(-3px) rotate(1.35deg)" }
        },
        campusCineHalo: {
          "0%, 100%": { opacity: "0.22", transform: "translate3d(-50%, -50%, 0) scale(0.92)" },
          "50%": { opacity: "0.38", transform: "translate3d(-50%, -50%, 0) scale(1.05)" }
        },
        campusCineMist: {
          "0%, 100%": { opacity: "0.13", transform: "translate(-50%, -47%) rotate(-2deg) scale(1)" },
          "50%": { opacity: "0.22", transform: "translate(-50%, -49%) rotate(2deg) scale(1.03)" }
        },
        campusPlayerFootShadow: {
          "0%, 100%": { opacity: "0.87" },
          "50%": { opacity: "1" }
        },
        vivoStudentDrift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "33%": { transform: "translate3d(16px,-8px,0)" },
          "66%": { transform: "translate3d(-11px,6px,0)" }
        },
        vivoDroneCrawl: {
          "0%": { transform: "translate3d(-12%,-4px,0)" },
          "100%": { transform: "translate3d(112%,3px,0)" }
        },
        vivoZonePulse: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.82", transform: "scale(1.025)" }
        },
        vivoTicker: {
          "0%": { transform: "translateX(4%)" },
          "100%": { transform: "translateX(-52%)" }
        },
        hudToastIn: {
          "0%": { opacity: "0", transform: "translate3d(6px,4px,0)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0)" }
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
        zoomIn: "zoomIn 1.6s ease-out both",
        campusPlayerIdle: "campusPlayerIdle 2.75s ease-in-out infinite",
        campusCineHalo: "campusCineHalo 4.2s ease-in-out infinite",
        campusCineMist: "campusCineMist 24s ease-in-out infinite",
        campusPlayerFootShadow: "campusPlayerFootShadow 3.15s ease-in-out infinite",
        vivoStudentDrift: "vivoStudentDrift 32s ease-in-out infinite",
        vivoDroneCrawl: "vivoDroneCrawl 58s linear infinite",
        vivoZonePulse: "vivoZonePulse 8.5s ease-in-out infinite",
        vivoTicker: "vivoTicker 46s linear infinite",
        hudToastIn: "hudToastIn 380ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
