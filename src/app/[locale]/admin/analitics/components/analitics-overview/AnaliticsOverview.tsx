"use client";
import React from "react";
import styles from "./AnaliticsOverview.module.css";
import { useTranslations } from "next-intl";

interface AnalyticsOverviewProps {
  products: Product[];
  orders: Order[];
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  products,
  orders,
}) => {
  const t = useTranslations("Analitics");

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const customerTotals: Record<
    string,
    { name: string; email: string; spent: number; orders: number }
  > = {};
  orders.forEach((order) => {
    const key = order.username || order.email;
    if (!customerTotals[key]) {
      customerTotals[key] = {
        name: `${order.firstName} ${order.lastName}`,
        email: order.email,
        spent: 0,
        orders: 0,
      };
    }
    customerTotals[key].spent += order.finalPrice;
    customerTotals[key].orders += 1;
  });

  Object.values(customerTotals).forEach((customer) => {
    customer.spent = Number(customer.spent.toFixed(2));
  });

  const topCustomers = Object.values(customerTotals)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  const numberOfOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.finalPrice, 0);
  const avgOrderValue =
    numberOfOrders > 0 ? (totalRevenue / numberOfOrders).toFixed(2) : "0";

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.widgetCard}>
        <h3 className={styles.widgetTitle}>{t("orderStatistics")}</h3>
        <div>
          <strong>{t("totalRevenue")}:</strong> €{totalRevenue}
        </div>
        <div>
          <strong>{t("numberOfOrders")}:</strong> {numberOfOrders}
        </div>
        <div>
          <strong>{t("averageOrderValue")}:</strong> €{avgOrderValue}
        </div>
      </div>
      <div className={styles.widgetCard}>
        <h3 className={styles.widgetTitle}>{t("productsOnLowStock")}</h3>
        {lowStockProducts.length === 0 ? (
          <p>{t("allProductsWellStocked")}</p>
        ) : (
          <ul className={styles.widgetList}>
            {lowStockProducts.map((p) => (
              <li key={p._id}>
                <a
                  className={styles.widgetLink}
                  href={`/product/${p._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.name}
                </a>{" "}
                ({t("stock")}: {p.stock})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.widgetCard}>
        <h3 className={styles.widgetTitle}>{t("topCustomersBySpending")}</h3>
        {topCustomers.length === 0 ? (
          <p>{t("noCustomersYet")}</p>
        ) : (
          <ol className={styles.widgetList}>
            {topCustomers.map((c) => (
              <li key={c.email}>
                {c.name} ({c.email}) — <strong>€{c.spent}</strong> ({c.orders}
                {t("orders")})
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default AnalyticsOverview;
