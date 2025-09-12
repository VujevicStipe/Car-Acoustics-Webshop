"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export const useHandleLogout = () => {
  const router = useRouter();
  const { refreshAuth } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        await refreshAuth();
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout", err);
    }
  };

  return handleLogout;
};
