"use client";

import useAuth from "@/hooks/useAuth";
import Header2 from "@/components/Header2";
import Footer from "@/components/footer";
import DashboardDiv1 from "@/components/DashboardDiv1";
import DashboardDiv2 from "@/components/DashboardDiv2";

export default function DashboardPage() {
  const { loading, isAuthenticated } = useAuth(true);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return null; // Redirect already handled

  return (
    <div className="flex flex-col min-h-screen">
      <Header2 />

        <p className="text-5xl text-center font-bold mb-4 text-[var(--color-P2)] text-stroke pt-3">
          Welcome To Your Dashboard
        </p>


      <DashboardDiv1 />
      <DashboardDiv2 />

      <Footer />
    </div>
  );
}
