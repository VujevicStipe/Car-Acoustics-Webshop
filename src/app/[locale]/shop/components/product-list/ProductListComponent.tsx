"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/app/[locale]/components/product-card/ProductCard";
import styles from "./ProductListComponent.module.css";
import useDeviceType from "@/app/hooks/useWindowSize";
import { useTranslations } from "next-intl";
import { toggleWishlist } from "@/app/lib/wishlist";
import { toast } from "sonner";
import { useWishlist } from "@/app/hooks/useWishlist";

export default function ProductListComponent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { wishlist, setWishlist } = useWishlist();

  const t = useTranslations("Products");
  const tWish = useTranslations("Wishlist");

  const deviceType = useDeviceType();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `/api/product?${searchParams.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleToggleWishlist = async (productId: string) => {
    const result = await toggleWishlist(productId, wishlist, setWishlist);

    if (result === "added") toast.success(tWish("wishlistSuccess"));
    if (result === "removed") toast.success(tWish("wishlistRemoved"));
    if (result === "error") toast.error(tWish("wishlistFailed"));
  };

  const category = searchParams.get("category");

  return (
    <div className={`${styles.productList} ${styles[deviceType]}`}>
      <h2 className={styles.title}>
        {category ? t(category) : t("allProducts")}{" "}
        <span className={styles.count}>({products.length})</span>
      </h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product._id} className={styles.gridItem}>
              <ProductCard
                _id={product._id}
                title={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                isWishlisted={
                  !!wishlist.find((w) => w.product._id === product._id)
                }
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
