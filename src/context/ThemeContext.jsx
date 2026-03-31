// ─────────────────────────────────────────────
// src/context/ThemeContext.jsx
// ─────────────────────────────────────────────
// Provides dark/light mode to the entire app.
// - Reads saved preference from localStorage
// - Falls back to system preference (prefers-color-scheme)
// - Toggles a "dark" class on <html> element
//   so Tailwind's dark: prefix works everywhere
// ─────────────────────────────────────────────

import { createContext, useContext, useEffect, useState } from "react";

// ── 1. Create the context ─────────────────────
const ThemeContext = createContext(null);

// ── 2. Helper: detect initial theme ──────────
const getInitialTheme = () => {
  // First priority: what the user chose last time
  const saved = localStorage.getItem("oms-theme");
  if (saved === "dark" || saved === "light") return saved;

  // Second priority: OS/browser preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";

  // Default fallback
  return "dark"; // our app is dark-first
};

// ── 3. Provider component ─────────────────────
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Persist the choice
    localStorage.setItem("oms-theme", theme);
  }, [theme]);

  // Toggle between dark and light
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = {
    theme,        // "dark" | "light"
    toggleTheme,  // call this from any component
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ── 4. Custom hook ────────────────────────────
// Usage in any component:
//   const { isDark, toggleTheme } = useTheme()
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }

  return context;
};