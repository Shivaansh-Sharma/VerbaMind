"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } else {
      router.push("/login"); // fallback
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      Authenticating...
    </div>
  );
}
