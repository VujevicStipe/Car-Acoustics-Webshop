export async function toggleWishlist(
  productId: string,
  wishlist: WishlistItem[],
  setWishlist: React.Dispatch<React.SetStateAction<WishlistItem[]>>
) {
  const item = wishlist.find((w) => w.product._id === productId);

  try {
    if (item) {
      const res = await fetch(`/api/wishlist/${item._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove");
      setWishlist((prev) => prev.filter((w) => w._id !== item._id));
      return "removed";
    } else {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed to add");
      const newItem: WishlistItem = await res.json();
      setWishlist((prev) => [newItem, ...prev]);
      return "added";
    }
  } catch (err) {
    console.error("toggleWishlist error:", err);
    return "error";
  }
}
