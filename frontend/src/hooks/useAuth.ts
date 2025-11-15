"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth(requireAuth = true) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait until localStorage is ready
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
            headers,
          }
        );

        const data = await res.json();

        if (data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          if (requireAuth) router.push("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
        setUser(null);
        if (requireAuth) router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    // Delay slightly so that localStorage updates finish after login redirect
    const timeout = setTimeout(checkAuth, 200);
    return () => clearTimeout(timeout);
  }, [requireAuth, router]);

  return { loading, isAuthenticated, user, setUser };
}
