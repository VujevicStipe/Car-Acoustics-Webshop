import React from "react";
import styles from "./TopProducts.module.css";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface TopProductsProps {
  products: Product[];
}

const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  const t = useTranslations("Analitics");

  if (!products || products.length === 0) {
    return <p>{t("noProductsSold")}</p>;
  }

  return (
    <div className={styles.topProductsContainer}>
      {products.map((product, idx) => (
        <Link
          key={product._id}
          href={`/product/${product._id}`}
          className={styles.productCard}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImage}
          />
          <h3 className={styles.productTitle}>
            #{idx + 1} {product.name}
          </h3>
          <div className={styles.productBrandModel}>
            {product.brand} • {product.model}
          </div>
          <div className={styles.productStat}>
            <strong>{t("sold")}:</strong> {product.totalSold}
          </div>
          <div className={styles.productStat}>
            <strong>{t("stock")}:</strong> {product.stock}
          </div>
          <div className={styles.productStat}>
            <strong>{t("price")}:</strong> {product.price} €
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopProducts;
