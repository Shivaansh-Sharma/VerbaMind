"use client";

import React from 'react'
import { motion } from "motion/react";
import TypingEffect1 from "@/components/HomeDiv3Typing1";
import TypingEffect2 from "@/components/HomeDiv3Typing2";
import Link from 'next/link';


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
Our text summarizer transforms lengthy documents, articles, or essays into concise, easy-to-understand summaries within seconds. It preserves the key points and essential details, ensuring you never miss important information. With features like word count, language detection, text summarization, and topic classification, it delivers clarity and efficiency, helping you quickly grasp the core message of any content.
</p>

<br />
  <TypingEffect2 />
         <br />
         <br />
         <br />
            <Link href='/summarizer'><motion.button className="px-6 py-3 btn-primary border-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')} >
            <span className=' text-[var(--color-BG)]'>Text Summarizer</ span>
          </motion.button></Link>
        </div>
        </motion.div>
  )
}

export default HomeDiv5