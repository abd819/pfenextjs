"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Prevent hydration mismatch by rendering a placeholder before mount
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <SunIcon className="w-6 h-6 text-amber-500" />
      ) : (
        <MoonIcon className="w-6 h-6 text-indigo-500" />
      )}
    </button>
  );
}
