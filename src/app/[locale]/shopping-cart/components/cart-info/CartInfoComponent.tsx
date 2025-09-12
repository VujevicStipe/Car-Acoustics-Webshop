"use client";
import React from "react";
import styles from "./CartInfoComponent.module.css";
import { useTranslations } from "next-intl";

interface CartInfoComponentProps {
  price: number;
}

export default function CartInfoComponent({ price }: CartInfoComponentProps) {
  const t = useTranslations("Order");

  const shippingCost = price >= 50 ? 0 : 4.99;
  const finalTotal = price + shippingCost;

  return (
    <div className={styles.orderInfo}>
      <div className={styles.totalSection}>
        <h4 className={styles.totalDetails}>
          {t("price")}: <strong>{price.toFixed(2)} €</strong>
        </h4>
        <h4 className={styles.totalDetails}>
          {t("shipping")}:{" "}
          {shippingCost === 0 ? (
            <strong>{t("free")}</strong>
          ) : (
            <strong>{shippingCost.toFixed(2)} €</strong>
          )}
        </h4>
        <h4 className={styles.totalDetails}>
          {t("total")}: <strong>{finalTotal.toFixed(2)} €</strong>
        </h4>
      </div>
      {/* <Link
        href={isEnabled ? "/checkout" : "#"}
        onClick={(e) => {
          if (!isEnabled) {
            toast.error("Košarica je prazna.");
          }
        }}
      >
        <ButtonComponent variant="primary" color="orange">
          {t("checkout")}
        </ButtonComponent>
      </Link> */}
      <div className={styles.line}></div>
      <div>
        <h4 className={styles.title}>{t("payment_title")}</h4>
        <p className={styles.details}>* {t("payment_text")}</p>
        <p className={styles.details}>* {t("payment_text2")}</p>
      </div>
      <div>
        <h4 className={styles.title}>{t("delivery_title")}</h4>
        <p className={styles.details}>{t("delivery_text")}</p>
      </div>
    </div>
  );
}
