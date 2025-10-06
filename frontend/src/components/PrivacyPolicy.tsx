"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="py-10 flex justify-center items-center"
    >
      <div className="max-w-4xl px-6 text-[var(--color-Text)]">
        {/* Heading */}
        <h1 className="text-3xl text-center font-bold mb-4">
          Privacy Policy
        </h1>
        <h2 className="text-xl text-center font-semibold mb-8">
          Effective Date: 15th September, 2025
        </h2>

        {/* Content */}
        <div className="space-y-6 text-lg leading-relaxed">
          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold text-center mb-2">1. Introduction</h2>
            <p>
              Welcome to <strong>VerbaMind</strong>. Your privacy is important
              to us. This Privacy Policy explains how we collect, use, and
              protect your information.
            </p>
          </motion.section>

          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold mb-2 text-center">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Personal Information:</strong> Name, email, age, and
                other details provided by you.
              </li>
              <li>
                <strong>Usage Data:</strong> Browsing activity, pages visited,
                and interactions on our platform.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies to improve
                your experience.
              </li>
            </ul>
          </motion.section>

          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold mb-2 text-center">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To provide and improve our services.</li>
              <li>To personalize your experience.</li>
              <li>To communicate with you about updates and support.</li>
            </ul>
          </motion.section>

          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold mb-2 text-center">4. Data Protection</h2>
            <p>
              We implement security measures to protect your data but cannot
              guarantee complete security.
            </p>
          </motion.section>

          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold mb-2 text-center">5. Third-Party Sharing</h2>
            <p>
              We do not sell your data. However, we may share data with trusted
              partners for service improvements.
            </p>
          </motion.section>

          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold mb-2 text-center">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your data. Contact
              us at{" "}
              <a
                href="mailto:neurocalm1@gmail.com"
                className="text-blue-600 hover:underline"
              >
                verbamind01@gmail.com
              </a>{" "}
              to make a request.
            </p>
          </motion.section>

          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold mb-2 text-center">7. Cookies Policy</h2>
            <p>
              We use cookies to enhance your browsing experience. You can manage
              your cookie preferences in your browser settings.
            </p>
          </motion.section>

          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold mb-2 text-center">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy. Please review it periodically
              for changes.
            </p>
          </motion.section>

          <motion.section whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}>
            <h2 className="text-xl font-bold mb-2 text-center">9. Contact Us</h2>
            <p>
              If you have any questions, reach out to us at{" "}
              <a
                href="mailto:verbamind01@gmail.com"
                className="text-blue-600 hover:underline"
              >
                verbamind01@gmail.com
              </a>
              .
            </p>
          </motion.section>

          <p className="text-center mt-6">
            <Link
              href="/TermsAndConditions"
              className="text-blue-600 font-semibold hover:underline"
            >
              Read our Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
