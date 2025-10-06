"use client";

import Header1 from "@/components/Header1";
import Footer from "@/components/footer";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";
import useRedirectIfAuth from "@/hooks/useRedirectIfAuth";
import { apiRequest } from "@/utils/api";

export default function SignupPage() {
  // Redirect logged-in users to /dashboard
  useRedirectIfAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/signup", "POST", { name, email, password });

      if (data?.accessToken) {
        // Cookies are already set by backend
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err);
    setError(err.message);
  } else {
    console.error(err);
    setError("Server error");
  } 
}
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header1 />

      <main className="flex-grow flex items-center justify-center bg-[var(--color-BG)] text-[var(--color-text)]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-2xl max-w-md"
        >
          <div className="bg-[var(--color-BG)] text-[var(--color-text)] p-8 rounded-lg shadow-md w-full max-w-md border-2">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-viper-green"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-viper-green"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-viper-green"
              />
              {error && <p className="text-red-500">{error}</p>}
              <motion.button
                type="submit"
                className="w-full py-2 px-4 bg-[var(--color-P1)] text-black hover:bg-[var(--color-P2)] rounded-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </form>

            <div className="mt-4 text-center">
              <motion.button
                onClick={handleGoogleSignup}
                className="w-full py-2 px-4 bg-red-500 text-white rounded-2xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                Sign up with Google
              </motion.button>
            </div>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-viper-green font-bold italic">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
