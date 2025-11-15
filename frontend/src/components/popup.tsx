// frontend/src/components/popup.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function HeaderPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => setIsOpen(!isOpen);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popupRef}>
      <button
        onClick={togglePopup}
        className="px-4 py-2 rounded-md border border-[var(--color-P1)] text-[var(--color-Text)] hover:bg-[var(--color-P1)] hover:text-[var(--color-BG)] transition-colors"
      >
        Menu
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-56 bg-[var(--color-BG)] text-[var(--color-Text)] rounded shadow-lg p-4 z-50 border border-[var(--color-P1)]/30"
        >
          <div className="mb-3 font-semibold text-sm opacity-80">
            Result History
          </div>

          {/* User Profile link */}
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block mb-4 text-sm underline underline-offset-2 hover:text-[var(--color-P2)]"
          >
            User Profile
          </Link>

          <div className="mb-3">
            <ThemeToggle />
          </div>

          <div>
            <LogoutButton />
          </div>
        </motion.div>
      )}
    </div>
  );
}
