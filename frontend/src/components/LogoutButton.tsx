"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";


export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <motion.button
      onClick={handleLogout}
      className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onHoverStart={() => console.log('hover started!')}
    >
      Logout
    </motion.button>
  );
}
