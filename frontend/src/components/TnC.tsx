"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

const TermsAndConditions = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="py-10 flex justify-center items-center"
    >
      <div className="max-w-4xl px-6 text-[var(--color-Text)]">
        {/* Heading */}
        <h1 className="text-3xl text-center font-bold mb-4">
          Terms and Conditions
        </h1>
        <h2 className="text-xl text-center font-semibold mb-8">
          Effective Date: 15th September, 2025
        </h2>

        {/* Content */}
        <div className="space-y-6 text-lg leading-relaxed">
          {/* 1. Introduction */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">1. Introduction</h2>
            <p>
              Welcome to <strong>VerbaMind</strong>! By accessing and using this
              website, you agree to comply with the following terms and
              conditions.
            </p>
          </motion.section>

          {/* 2. Eligibility */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">2. Eligibility</h2>
            <p>
              You must be at least 18 years old or have parental consent to use
              our services.
            </p>
          </motion.section>

          {/* 3. Nature of Services */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">3. Nature of Services</h2>
            <p>
VerbaMind aims to address this gap by providing an integrated solution that performs language
detection, sentiment analysis, grammar check, summarization, topic classification, tone analysis, word/character
count, and plagiarism detection all in one place.
            </p>
          </motion.section>

          {/* 4. User Responsibilities */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">4. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide accurate and truthful information.</li>
              <li>Do not share your account credentials.</li>
              <li>Do not engage in illegal or harmful activities on our platform.</li>
            </ul>
          </motion.section>

          {/* 5. Privacy Policy */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">5. Privacy Policy</h2>
            <p>
              We collect and use data as outlined in our{" "}
              <Link
                href="/PrivacyPolicy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
              . By using NeuroCalm, you consent to our data practices.
            </p>
          </motion.section>

          {/* 6. Intellectual Property */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">6. Intellectual Property</h2>
            <p>
              All content on VerbaMind is owned by us or licensed for use. You
              may not copy or distribute any content without permission.
            </p>
          </motion.section>

          {/* 7. Third-Party Links */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">7. Third-Party Links</h2>
            <p>
              We may provide links to external services, but we are not
              responsible for their content or policies.
            </p>
          </motion.section>

          {/* 8. Limitation of Liability */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">8. Limitation of Liability</h2>
            <p>
              We are not responsible for any outcomes or damages resulting from
              the use of our services. If you need urgent help, please contact a
              licensed mental health professional.
            </p>
          </motion.section>

          {/* 9. Subscription and Payments */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">
              9. Subscription and Payments (If Applicable)
            </h2>
            <p>
              Some features may require payment. All payments are non-refundable
              unless required by law.
            </p>
          </motion.section>

          {/* 10. Termination */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate access if these Terms
              are violated.
            </p>
          </motion.section>

          {/* 11. Governing Law */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">11. Governing Law</h2>
            <p>
              These Terms are governed by Indian law. Any disputes will be
              resolved in Chandigarh, India.
            </p>
          </motion.section>

          {/* 12. Contact Us */}
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">12. Contact Us</h2>
            <p>
              If you have any questions, please contact us at{" "}
              <a
                href="mailto:verbamind01@gmail.com"
                className="text-blue-600 hover:underline"
              >
                verbamind01@gmail.com
              </a>
              .
            </p>
          </motion.section>

          {/* Footer Link */}
          <p className="text-center mt-6">
            <Link
              href="/PrivacyPolicy"
              className="text-blue-600 font-semibold hover:underline"
            >
              Read our Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsAndConditions;
