"use client";

import React from 'react'
import { motion } from "motion/react";
import Link from 'next/link';

const HomeDiv1 = () => {
  return (
    <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} className='py-10 flex justify-between items-center'>
        <div className="text-center justify-left w-1/2 px-6 ">
          <h1 className="text-5xl text-center font-bold mb-4">
            Think big. Write brilliantly.
          </h1>
          <p className="text-xl text-left text-[var(--color-Text)]">
            Your ideas deserve clarity. With AI that understands your intent, your writing transforms from a spark of inspiration to a flawless final draft. Focus on the message let us handle the words.
          </p>

        </div>
        <div className='w-1/2 px-6 text-center'>
         
        </div>
        </motion.div>
  )
}

export default HomeDiv1