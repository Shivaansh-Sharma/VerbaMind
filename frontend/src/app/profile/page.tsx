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

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-BG)] text-[var(--color-Text)]">
      <Header2 />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <section className="w-full max-w-xl bg-[var(--color-cardBG)] rounded-2xl shadow-md p-6">
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

            {/* Messages */}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {success && (
              <div className="text-sm text-green-500">{success}</div>
            )}
          </div>

          <div className="pt-4 text-sm opacity-70">
            (In future you can add options here to change password, delete
            account, etc.)
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
