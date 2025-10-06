"use client";

import React from 'react'
import { motion } from "motion/react";
import Link from 'next/link';

const HomeDiv2 = () => {
  return (
    <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} className='py-10 flex justify-between items-center'>
        <div className="text-center justify-left w-1/2 px-6 ">


        </div>
        <div className='w-1/2 px-6 text-center'>
          <h1 className='text-5xl text-center font-bold mb-4'>
            Start Right Here
          </h1>

           <br />
<p className="text-xl text-[var(--color-Text)]">
  By logging in, you agree to our{" "}
  <Link href="/PrivacyPolicy" className="text-blue-600 hover:underline">
    Privacy Policy
  </Link>{" "}
  and{" "}
  <Link href="/TermsAndConditions" className="text-blue-600 hover:underline">
    Terms & Conditions
  </Link>.
</p>

          <br />
          <Link href='/login'><motion.button className="px-6 py-3 btn-primary border-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')} >
            <span className=' text-[var(--color-BG)]'>Login</ span>
          </motion.button></Link>
        
        </div>
        </motion.div>
  )
}

export default HomeDiv2