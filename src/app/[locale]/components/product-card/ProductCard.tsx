"use client";

import styles from "./ProductCard.module.css";
import Link from "next/link";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface ProductCardProps {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  isWishlisted?: boolean;
  onToggleWishlist?: (_id: string) => void;
}

export default function ProductCard({
  _id,
  title,
  price,
  imageUrl,
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <Link href={`/product/${_id}`} passHref>
      <div className={styles.productCard}>
        {onToggleWishlist && (
          <button
            className={styles.wishlistBtn}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleWishlist(_id);
            }}
            aria-label="Toggle wishlist"
          >
            {isWishlisted ? (
              <AiFillHeart size={24} color="red" />
            ) : (
              <AiOutlineHeart size={24} color="red" />
            )}
          </button>
        )}
        <div className={styles.imageContainer}>
          <img className={styles.cardImage} src={imageUrl} alt={title} />
        </div>
        <h4 className={styles.title}>{title}</h4>
        <h3 className={styles.price}>
          {new Intl.NumberFormat("hr-HR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(price)}{" "}
          €
        </h3>
      </div>
    </Link>
  );
}
