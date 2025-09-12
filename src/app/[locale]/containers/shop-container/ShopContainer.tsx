"use client";

import React from "react";
import styles from "./ShopContainer.module.css";
import useDeviceType from "@/app/hooks/useWindowSize";
import ButtonComponent from "../../components/button/ButtonComponent";
import FilterComponent from "../../shop/components/filter-component/FilterComponent";
import { ShoppingCartIcon } from "lucide-react";
import ProductListComponent from "../../shop/components/product-list/ProductListComponent";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import banner from "@/public/banner.svg";
import Image from "next/image";

export default function ShopContainer() {
  const searchParams = useSearchParams();
  const deviceType = useDeviceType();
  const t = useTranslations("Order");
  const tProducts = useTranslations("Products");
  const category = searchParams.get("category");

  return (
    <div className={`container ${styles.shopContainer} ${styles[deviceType]}`}>
      <div className={styles.shopBanner}>
        <Image
          className={styles.bannerImage}
          src={banner}
          alt="speaker accessories banner"
        />
        <h2 className={styles.title}>
          {category ? tProducts(category) : tProducts("allProducts")}{" "}
        </h2>
      </div>
      <div className={`${styles.shopContent} ${styles[deviceType]}`}>
        <div className={styles.leftSection}>
          <Link href="/shopping-cart">
            <ButtonComponent variant="secondary" color="orange">
              {t("cart")}
              <ShoppingCartIcon size={20} style={{ marginLeft: "0.5rem" }} />
            </ButtonComponent>
          </Link>
          <FilterComponent />
        </div>
        <ProductListComponent />
      </div>
    </div>
  );
}
