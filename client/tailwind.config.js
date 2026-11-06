/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#FFF6E5", dark: "#FFEBC8", deeper: "#F6D9A5" },
        cocoa: { 50: "#FBEFE9", 700: "#5B1F14", 800: "#471710", 900: "#34100B", 950: "#230A07" },
        chili: { DEFAULT: "#D8301F", dark: "#B02416", light: "#FF6B4A" },
        spice: { DEFAULT: "#FFB22C", dark: "#E89A0C", light: "#FFD27A" },
        ink: "#261712",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        pop: "5px 5px 0 0 #34100B",
        "pop-lg": "8px 8px 0 0 #34100B",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        steam: {
          "0%": { opacity: "0", transform: "translateY(8px) scaleX(1)" },
          "40%": { opacity: "0.7" },
          "100%": { opacity: "0", transform: "translateY(-18px) scaleX(1.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-6deg)" },
          "50%": { transform: "translateY(-16px) rotate(6deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-14deg) scale(1.1)" },
          "75%": { transform: "rotate(14deg) scale(1.1)" },
          "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
          },
          "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        steam: "steam 2.6s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        marquee: "marquee 24s linear infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        wiggle: "wiggle 0.6s ease-in-out",
        "slide-in": "slide-in 0.3s ease-out both",
        "fade-in": "fade-in 0.2s ease-out both",
      },
    },
  },
  plugins: [],
};