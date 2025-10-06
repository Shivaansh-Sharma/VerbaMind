"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth(requireAuth = true) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // store user info
  
  interface User {
  id: int;
  name: text;
  email: text;
  password: text;
  created_at: timestamp;
    
  // add any other fields your user has
}

// Then
const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          {
            credentials: "include", // important!
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

    checkAuth();
  }, [requireAuth, router]);

  return { loading, isAuthenticated, user };
}
