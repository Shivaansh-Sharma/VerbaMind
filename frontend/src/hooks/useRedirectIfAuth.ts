"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function useRedirectIfAuth() {
  const { loading, isAuthenticated } = useAuth(false); // don't require auth here
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard"); // redirect logged-in users
    }
  }, [loading, isAuthenticated, router]);
}
