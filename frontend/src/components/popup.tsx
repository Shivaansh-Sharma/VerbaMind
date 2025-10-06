"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import LogoutButton from "./LogoutButton"
import ThemeToggle from "./ThemeToggle"

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={togglePopup}
        className="px-4 py-2 btn-primary border-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}
      >
        <span className="text-[var(--color-BG)]">Options</span>
      </motion.button>

      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 bg-[var(--color-BG)] text-[var(--color-Text)] rounded shadow-lg p-4 z-50"
        >
          <div className="mb-2 font-semibold">Result History</div>
          <div>User Profile</div>
          <br />
          <div><ThemeToggle /></div>
          <br />
          <div><LogoutButton /></div>
        </motion.div>
      )}
    </div>
  );
}
