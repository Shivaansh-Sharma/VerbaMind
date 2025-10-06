"use client";

import React from 'react'
import { motion } from "motion/react";


const HomeDiv3 = () => {
  return (
    <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} className='py-10 flex justify-between items-center'>
        <div className="text-center justify-left w-1/2 px-6 ">
          <h1 className="text-5xl text-center font-bold mb-4">
            Smarter Writing, Made Simple
          </h1>
          <p className="text-xl text-left text-[var(--color-Text)]">
            Transform your ideas into flawless writing with instant AI guidance that spots errors and sharpens your words effortlessly.
          </p>

        </div>
        <div className='w-1/2 px-6 text-center'>
        </div>
        </motion.div>
  )
}

export default HomeDiv3