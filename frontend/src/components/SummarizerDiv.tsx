"use client";

import React from 'react'
import { motion } from "motion/react";
import TypingEffect2 from "@/components/HomeDiv3Typing2";


const SummarizerDiv1 = () => {
  return (
    <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} className='py-10 flex justify-between items-center'>
        <div className="text-center ">
          <h1 className="text-5xl text-center font-bold mb-4">
            Text Summarizer
          </h1>
          <p className="text-xl text-left text-[var(--color-Text)]">
           Our text summarizer transforms lengthy documents, articles, or essays into concise, easy-to-understand summaries within seconds. It preserves the key points and essential details, ensuring you never miss important information. With features like word count, language detection, text summarization, and topic classification, it delivers clarity and efficiency, helping you quickly grasp the core message of any content.
          </p>
          <br />
         <TypingEffect2 />

        </div>
        </motion.div>
  )
}

export default SummarizerDiv1