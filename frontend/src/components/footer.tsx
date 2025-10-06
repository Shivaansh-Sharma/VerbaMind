"use client";

import { Github } from "lucide-react";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <footer
      className="
        w-full border-t
        bg-[var(--color-Light-BG)] text-[var(--color-Light-Text)]
        py-4 text-sm transition-colors
      "
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">VerbaMind</span>. All rights reserved.
        </p>

        <motion.a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-[var(--color-Light-P2)] dark:hover:text-[var(--color-Dark-P2)] transition-colors"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}
        >
          <Github className="w-5 h-5" />
          <span>Github Repo</span>
        </motion.a>
      </div>
    </footer>
  );
};

export default Footer;
