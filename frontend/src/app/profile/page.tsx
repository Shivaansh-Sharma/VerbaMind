// frontend/src/app/profile/page.tsx
"use client";

import useAuth from "@/hooks/useAuth";
import Header2 from "@/components/Header2";
import Footer from "@/components/footer";

export default function ProfilePage() {
  const { loading, isAuthenticated, user } = useAuth(true);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || !user) return null; // redirect handled in useAuth

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-BG)] text-[var(--color-Text)]">
      <Header2 />

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[var(--color-P2)] text-stroke text-center">
          Your Profile
        </h1>

        <section className="w-full max-w-xl border border-[var(--color-P1)]/30 rounded-2xl shadow-md p-6 md:p-8 space-y-6 bg-[var(--color-BG)]">
          <div className="space-y-1">
            <p className="text-sm opacity-70">Name</p>
            <p className="text-xl font-semibold">{user.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm opacity-70">Email</p>
            <p className="text-lg break-all">{user.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm opacity-70">User ID</p>
            <p className="text-xs break-all opacity-80">{user.id}</p>
          </div>

          {/* If you later add created_at on /auth/me you can show it here:
          {user.created_at && (
            <div className="space-y-1">
              <p className="text-sm opacity-70">Member since</p>
              <p className="text-sm">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
          */}

          <div className="pt-4 text-sm opacity-70">
            (In future you can add options here to edit your name, change
            password, etc.)
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
