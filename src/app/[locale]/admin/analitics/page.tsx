"use client";
import React, { useEffect, useState } from "react";
import styles from "./AnaliticsAdmin.module.css";
import TopProducts from "./components/top-products/TopProducts";
import AnalyticsOverview from "./components/analitics-overview/AnaliticsOverview";
import { useTranslations } from "next-intl";
import OrdersByDayChart from "./components/orders-by-day-chart/OrdersByDayChart";

export default function AnaliticsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Analitics");

  useEffect(() => {
    Promise.all([
      fetch("/api/product").then((res) => res.json()),
      fetch("/api/orders").then((res) => res.json()),
    ]).then(([products, orders]) => {
      setProducts(products);
      setOrders(orders);
      setLoading(false);
    });
  }, []);

  const topProducts =
    products?.sort((a, b) => b.totalSold - a.totalSold).slice(0, 3) || [];

  return (
    <div className={`${styles.analiticsAdmin}`}>
      <h1 className={styles.title}>{t("webshopAnalytics")}</h1>
      <h2 className={styles.sectionTitle}>{t("topSellingProducts")}</h2>
      <div className={styles.topProductsWrapper}>
        {loading ? <p>Loading...</p> : <TopProducts products={topProducts} />}
      </div>
      <h2 className={styles.sectionTitle}>
        Prikaz zarade/broja narudžbi po danima
      </h2>
      <OrdersByDayChart orders={orders} />

      <h2 className={`${styles.sectionTitle} ${styles.lastTitle}`}>Overview statistics</h2>
      <AnalyticsOverview products={products} orders={orders} />
    </div>
  );
}
