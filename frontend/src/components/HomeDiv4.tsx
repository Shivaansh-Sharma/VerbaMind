"use client";

import React from 'react'
import { motion } from "motion/react";


const HomeDiv4 = () => {
  return (
    <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} className='py-10 flex justify-between items-center'>
        <div className="text-center justify-left w-1/2 px-6 ">
         
        </div>
        <div className='w-1/2 px-6 text-center'>
          <h1 className='text-5xl text-center font-bold mb-4'>
         Expert Guidance, Just a Click Away
          </h1>

          <p className="text-xl text-left text-[var(--color-Text)]">
            Elevate your writing with instant insights from trusted experts, ensuring every word is sharp, accurate, and compelling.
          </p>
        </div>
        </motion.div>
  )
}

export default HomeDiv4