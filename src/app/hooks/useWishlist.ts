import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [, setLoading] = useState(false);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated === null) return;
    if (!isAuthenticated) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/wishlist", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch wishlist");
        const data: WishlistItem[] = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
      } catch {
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  return { wishlist, setWishlist };
};
