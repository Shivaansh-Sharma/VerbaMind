"use client";

import React from 'react'
import { motion } from "motion/react";
import TypingEffect2 from "@/components/HomeDiv3Typing2";


const HomeDiv5 = () => {
  return (
    <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} className='py-10 flex justify-between items-center'>
        <div className="text-center justify-left w-1/2 px-6 ">

        </div>
        <div className='w-1/2 px-6 text-center'>
<h1 className="text-5xl text-center font-bold mb-4">
  Text Summarizer
</h1>
<p className="text-xl text-center text-[var(--color-Text)] leading-relaxed max-w-2xl mx-auto mb-6">
  Turn long documents, articles, or essays into clear and concise summaries in 
  seconds. Our text summarizer keeps the key points intact so you can grasp 
  the essence without missing important details.With features such as:-
</p>

{/* Typing effect showing summary styles */}
<div className="text-center">
  <TypingEffect2 />
</div>
        </div>
        </motion.div>
  )
}

export default HomeDiv5
