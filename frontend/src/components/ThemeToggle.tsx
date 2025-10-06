"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Apply a short-lived class to animate theme switching
  const changeTheme = (value: string) => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    setTheme(value);

    window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 400); // should be a bit longer than your CSS transition
  };

  const isActive = (value: string) => theme === value;
  const baseBtn =
    "flex items-center justify-center w-10 h-10 rounded-md transition-colors";

  return (
    <div
      className="flex gap-2 p-1 rounded-lg"
      style={{
        backgroundColor: "var(--color-BG)",
        border: "1px solid var(--color-P1)",
      }}
    >
      {/* Light */}
      <button
        onClick={() => changeTheme("light")}
        className={`${baseBtn} ${
          isActive("light")
            ? "bg-[var(--color-P1)] text-[var(--color-BG)]"
            : "text-[var(--color-Text)] hover:bg-[var(--color-P2)] hover:text-[var(--color-BG)]"
        }`}
      >
        <Sun className="w-5 h-5" />
      </button>

      {/* Dark */}
      <button
        onClick={() => changeTheme("dark")}
        className={`${baseBtn} ${
          isActive("dark")
            ? "bg-[var(--color-P1)] text-[var(--color-BG)]"
            : "text-[var(--color-Text)] hover:bg-[var(--color-P2)] hover:text-[var(--color-BG)]"
        }`}
      >
        <Moon className="w-5 h-5" />
      </button>

      {/* System */}
      <button
        onClick={() => changeTheme("system")}
        className={`${baseBtn} ${
          isActive("system")
            ? "bg-[var(--color-P1)] text-[var(--color-BG)]"
            : "text-[var(--color-Text)] hover:bg-[var(--color-P3)] hover:text-[var(--color-BG)]"
        }`}
      >
        <Laptop className="w-5 h-5" />
      </button>
    </div>
  );
}
