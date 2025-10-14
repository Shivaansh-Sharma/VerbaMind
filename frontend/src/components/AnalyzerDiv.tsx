"use client";

import React from "react";
import { motion } from "motion/react";
import TypingEffect1 from "@/components/HomeDiv3Typing1";

const AnalyzerDiv = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-full min-h-[70vh] flex justify-center items-center py-16"
    >
      <div className="text-center max-w-3xl px-6">
        <h1 className="text-5xl font-bold mb-4">Text Analyzer</h1>
        <p className="text-xl text-[var(--color-Text)] mb-6">
          Our advanced text analyzer helps you go beyond simple writing checks
          by offering powerful tools to refine your content. It instantly
          measures word count, detects language, and identifies plagiarism while
          also analyzing tone and sentiment. With grammar check included, it
          ensures clarity, accuracy, and impact, making your writing more
          professional, engaging, and reliable for any purpose.
        </p>
        <TypingEffect1 />
      </div>
    </motion.div>
  );
};

export default AnalyzerDiv;
