"use client";
import React from "react";
import { useTranslations } from "next-intl";
import ProductCard from "../../components/product-card/ProductCard";
import styles from "./WishlistItems.module.css";

type WishlistProps = {
  loading: boolean;
  items: WishlistItem[];
  onToggleWishlist: (productId: string) => void;
};

export default function WishlistItems({
  loading,
  items,
  onToggleWishlist,
}: WishlistProps) {
  const tWish = useTranslations("Wishlist");

  if (loading) return <p>{tWish("loadingWishlist")}</p>;
  if (!items || items.length === 0) return <p>{tWish("noWishlist")}</p>;

  return (
    <div className={`section ${styles.wrapWishlist}`}>
      <h2 className={styles.title}>{tWish("wishlist")}</h2>
      <div className={styles.wishlist}>
        {items.map((item) => (
          <ProductCard
            key={item._id}
            _id={item.product._id}
            title={item.product.name}
            price={item.product.price}
            imageUrl={item.product.imageUrl}
            isWishlisted={true}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </div>
  );
}
