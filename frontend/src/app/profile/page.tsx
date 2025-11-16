// frontend/src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Header2 from "@/components/Header2";
import Footer from "@/components/footer";
import { apiRequest } from "@/utils/api";

interface UpdateNameResponse {
  user: {
    id: number;
    name: string;
    email: string;
    // created_at is on your User type, but not needed in this response
  };
  accessToken?: string;
  message?: string;
}

export default function ProfilePage() {
  const { loading, isAuthenticated, user, setUser } = useAuth(true);

  const [name, setName] = useState(user?.name ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password reset via OTP state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  // keep local name in sync with user from hook
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || !user) return null; // redirect handled in useAuth

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest<UpdateNameResponse>(
        "/auth/me/name",
        "PUT",
        { name: trimmed },
        true // auth = true, send Authorization header
      );

      // update token if backend sent a fresh one
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
      }

      // update user in auth context, preserving all existing fields (like created_at)
      if (setUser) {
        setUser((prev) => (prev ? { ...prev, name: data.user.name } : prev));
      }

      setSuccess(data.message ?? "Name updated successfully");
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update name");
      } else {
        setError("Failed to update name");
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Password reset handlers
  // =========================

  const handleSendPasswordOtp = async () => {
    try {
      setPwdError(null);
      setPwdSuccess(null);
      setPwdLoading(true);

      await apiRequest<{ message: string }>(
        "/auth/password/reset/request-otp",
        "POST",
        {},
        true
      );

      setOtpSent(true);
      setOtpVerified(false);
      setOtp("");
      setPwdSuccess("OTP sent to your email.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPwdError(err.message || "Failed to send OTP");
      } else {
        setPwdError("Failed to send OTP");
      }
    } finally {
      setPwdLoading(false);
    }
  };

  const handleVerifyPasswordOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      setPwdError(null);
      setPwdSuccess(null);
      setPwdLoading(true);

      await apiRequest<{ message: string }>(
        "/auth/password/reset/verify-otp",
        "POST",
        { otp },
        true
      );

      setOtpVerified(true);
      setPwdSuccess("OTP verified. You can now set a new password.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPwdError(err.message || "Failed to verify OTP");
      } else {
        setPwdError("Failed to verify OTP");
      }
    } finally {
      setPwdLoading(false);
    }
  };

  const handleUpdatePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      setPwdError(null);
      setPwdSuccess(null);
      setPwdLoading(true);

      if (newPassword !== confirmNewPassword) {
        setPwdError("Passwords do not match");
        return;
      }

      await apiRequest<{ message: string }>(
        "/auth/password/reset/update",
        "POST",
        { newPassword, confirmNewPassword },
        true
      );

      setPwdSuccess("Password updated successfully.");
      setNewPassword("");
      setConfirmNewPassword("");
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPwdError(err.message || "Failed to update password");
      } else {
        setPwdError("Failed to update password");
      }
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-BG)] text-[var(--color-Text)]">
      <Header2 />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <section className="w-full max-w-xl bg-[var(--color-BG)] rounded-2xl shadow-md p-6 border border-[var(--color-P2)]">
          <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

          <div className="space-y-4">
            {/* Email - read only */}
            <div>
              <p className="text-sm opacity-70">Email</p>
              <p className="font-mono break-all">{user.email}</p>
            </div>

            {/* Name - editable */}
            <div>
              <p className="text-sm opacity-70 mb-1">Name</p>

              {!isEditing ? (
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{user.name}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setSuccess(null);
                      setIsEditing(true);
                    }}
                    className="px-3 py-1 text-sm rounded-full border border-[var(--color-P1)] hover:bg-[var(--color-P1)] hover:text-black transition"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none"
                    placeholder="Enter your name"
                    disabled={saving}
                  />

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setName(user.name);
                        setIsEditing(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      className="px-3 py-1 text-sm rounded-full border hover:bg-[var(--color-cardBG)]"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-sm rounded-full bg-[var(--color-P1)] text-black font-semibold disabled:opacity-60"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Messages for name update */}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {success && (
              <div className="text-sm text-green-500">{success}</div>
            )}
          </div>

          {/* Password Reset via OTP */}
          <div className="mt-8 border border-[var(--color-P3)] rounded-2xl p-4 bg-[var(--color-cardBG)]/60">
            <h2 className="text-lg font-semibold mb-2">Reset Password</h2>
            <p className="text-sm opacity-70 mb-4">
              You can change your password by verifying an OTP sent to your
              email address: <span className="font-mono">{user.email}</span>
            </p>

            {/* Status messages for password reset */}
            {pwdError && (
              <p className="text-sm text-red-500 mb-2">{pwdError}</p>
            )}
            {pwdSuccess && (
              <p className="text-sm text-green-500 mb-2">{pwdSuccess}</p>
            )}

            {/* Step 1: Send OTP button */}
            {!otpSent && (
              <button
                type="button"
                onClick={handleSendPasswordOtp}
                disabled={pwdLoading}
                className="px-4 py-2 rounded-full border border-[var(--color-P2)] hover:bg-[var(--color-P2)] hover:text-black transition text-sm"
              >
                {pwdLoading ? "Sending OTP..." : "Send OTP to Email"}
              </button>
            )}

            {/* Step 2: Enter OTP */}
            {otpSent && !otpVerified && (
              <form
                onSubmit={handleVerifyPasswordOtp}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="block text-sm mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none"
                    placeholder="6-digit OTP"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={pwdLoading || !otp}
                    className="px-4 py-2 rounded-full border border-[var(--color-P1)] hover:bg-[var(--color-P1)] hover:text-black transition text-sm"
                  >
                    {pwdLoading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendPasswordOtp}
                    disabled={pwdLoading}
                    className="text-xs underline opacity-80"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New password form */}
            {otpVerified && (
              <form
                onSubmit={handleUpdatePassword}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="block text-sm mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none"
                    placeholder="Re-enter new password"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setOtp("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                      setOtpSent(false);
                      setOtpVerified(false);
                      setPwdError(null);
                      setPwdSuccess(null);
                    }}
                    className="px-3 py-2 rounded-full border text-sm hover:bg-[var(--color-cardBG)]"
                    disabled={pwdLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      pwdLoading || !newPassword || !confirmNewPassword
                    }
                    className="px-4 py-2 rounded-full border border-[var(--color-P1)] hover:bg-[var(--color-P1)] hover:text-black transition text-sm"
                  >
                    {pwdLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
