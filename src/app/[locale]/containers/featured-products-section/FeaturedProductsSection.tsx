"use client";
import React, { useEffect, useState } from "react";
import styles from "./FeaturedProductsSection.module.css";
import { getProducts } from "@/app/lib/getProducts";
import ProductCard from "../../components/product-card/ProductCard";
import { useTranslations } from "next-intl";
import Image from "next/image";
import texture from "@/public/texture_last.svg";
import { toggleWishlist } from "@/app/lib/wishlist";
import { useWishlist } from "@/app/hooks/useWishlist";

export default function FeaturedProductsSection() {
  const t = useTranslations("Index");
  // const tWish = useTranslations("Wishlist");
  const [products, setProducts] = useState<Product[]>([]);

  const { wishlist, setWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        const shuffled = data.sort(() => 0.5 - Math.random());
        const randomFour = shuffled.slice(0, 4);
        setProducts(randomFour);
      } catch (error) {
        console.error("Greška kod prikaza proizvoda:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId, wishlist, setWishlist);
  };

  return (
    <div className={`section ${styles.container}`}>
      <div className={styles.bgTexture}>
        <Image className={styles.textureImg} src={texture} alt="texture" />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{t("featured_sec_title")}</h2>
        <div className={styles.featuredProducts}>
          {products.map((product) => {
            const isWishlisted = wishlist.some(
              (i) => i.product._id === product._id
            );
            return (
              <ProductCard
                key={product._id}
                _id={product._id}
                title={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                isWishlisted={isWishlisted}
                onToggleWishlist={handleToggleWishlist}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
