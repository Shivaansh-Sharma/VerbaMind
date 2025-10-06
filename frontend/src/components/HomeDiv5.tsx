"use client";

import React from 'react'
import { motion } from "motion/react";
import TypingEffect1 from "@/components/HomeDiv3Typing1";
import TypingEffect2 from "@/components/HomeDiv3Typing2";


const HomeDiv5 = () => {
  return (
    <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} className='py-10 flex justify-between items-center'>
        <div className="text-center justify-left w-1/2 px-6 ">
          <h1 className="text-5xl text-center font-bold mb-4">
            Text Analyzer
          </h1>
          <p className="text-xl text-left text-[var(--color-Text)]">
            Go beyond basic writing checks with our advanced text analyzer. Instantly measure, detect, 
  and refine your content with tools designed to improve clarity, accuracy, and impact. With features such as:-
          </p>
          <br />
        <TypingEffect1 />
        </div>
        <div className='w-1/2 px-6 text-center'>

        </div>
        </motion.div>
  )
}

export default HomeDiv5