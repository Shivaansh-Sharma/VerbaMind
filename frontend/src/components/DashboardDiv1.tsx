"use client";

import React from 'react'
import { motion } from "motion/react";
import TypingEffect1 from "@/components/HomeDiv3Typing1";
import Link from 'next/link';


const DashboardDiv1 = () => {
  return (
    <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} className='py-10 flex justify-between items-center'>
        <div className="text-center justify-left w-1/2 px-6 ">
          <h1 className="text-5xl text-center font-bold mb-4">
            Text Analyzer
          </h1>
          <p className="text-xl text-left text-[var(--color-Text)]">
           Our advanced text analyzer helps you go beyond simple writing checks by offering powerful tools to refine your content. It instantly measures word count, detects language, and identifies plagiarism while also analyzing tone and sentiment. With grammar check included, it ensures clarity, accuracy, and impact, making your writing more professional, engaging, and reliable for any purpose.
          </p>
          <br />
         <TypingEffect1 />
         <br />
         <br />
         <br />
            <Link href='/analyzer'><motion.button className="px-6 py-3 btn-primary border-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')} >
            <span className=' text-[var(--color-BG)]'>Text Analyzer</ span>
          </motion.button></Link>
        </div>
        <div className='w-1/2 px-6 text-center'>

        </div>
        </motion.div>
  )
}

export default DashboardDiv1