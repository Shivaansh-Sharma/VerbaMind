"use client";

import Header1 from "@/components/Header1";
import Footer from "@/components/footer";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";
import useRedirectIfAuth from "@/hooks/useRedirectIfAuth";
import { apiRequest } from "@/utils/api";

interface SignupResponse {
  accessToken?: string;
  message?: string;
}

interface SignupOtpResponse {
  message?: string;
}

export default function SignupPage() {
  useRedirectIfAuth(); // redirect if already logged in

  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest<SignupOtpResponse>("/auth/signup/request-otp", "POST", {
        name,
        email,
        password,
      });

      setInfo(data.message || "OTP sent to your email");
      setStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      setLoading(true);

      const data = await apiRequest<SignupResponse>("/auth/signup/verify-otp", "POST", {
        email,
        otp,
      });

      if (data.accessToken) {
        // backend also sets HttpOnly cookies
        localStorage.setItem("token", data.accessToken);
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to verify OTP");
      }
    } finally {
      setLoading(false);
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
            <h2 className="text-2xl font-bold mb-6 text-center">
              {step === 1 ? "Sign Up" : "Verify Email"}
            </h2>

            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-viper-green"
                />

                {error && <p className="text-red-500">{error}</p>}
                {info && <p className="text-green-500">{info}</p>}

                <motion.button
                  type="submit"
                  className="w-full py-2 px-4 bg-[var(--color-P1)] text-black hover:bg-[var(--color-P2)] rounded-2xl disabled:opacity-70"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </motion.button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-gray-400">
                  We have sent a 6-digit OTP to <span className="font-semibold">{email}</span>.
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-viper-green tracking-[0.4em] text-center"
                />

                {error && <p className="text-red-500">{error}</p>}
                {info && <p className="text-green-500">{info}</p>}

                <motion.button
                  type="submit"
                  className="w-full py-2 px-4 bg-[var(--color-P1)] text-black hover:bg-[var(--color-P2)] rounded-2xl disabled:opacity-70"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Sign Up"}
                </motion.button>

                <button
                  type="button"
                  className="w-full text-sm mt-2 underline"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </form>
            )}

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
