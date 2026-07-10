"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 opacity-0" />; // Placeholder to avoid layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full glass-button hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <span className="text-xl leading-none" title="Light Mode">☀️</span>
      ) : (
        <span className="text-xl leading-none" title="Dark Mode">🌙</span>
      )}
    </button>
  );
}

