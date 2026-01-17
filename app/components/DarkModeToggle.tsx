// components/DarkModeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem("theme");
    const isDarkMode =
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(isDarkMode);

    // Apply to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isDark ? (
        <Sun className="h-6 w-6 text-primary" />
      ) : (
        <Moon className="h-6 w-6 text-primary" />
      )}

      <Switch
        checked={isDark}
        onCheckedChange={toggleDarkMode}
        aria-label="Toggle dark mode"
        className="h-6 w-10 p-1 hover:cursor-pointer"
      />
    </div>
  );
}
