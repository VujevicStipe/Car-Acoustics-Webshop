import React from "react";
import styles from "./UserOrdersTable.module.css";
import useDeviceType from "@/app/hooks/useWindowSize";
import { useTranslations } from "next-intl";

interface UserOrdersTableProps {
  orders: Order[];
}

export default function UserOrdersTable({ orders }: UserOrdersTableProps) {
  const deviceType = useDeviceType();
  const t = useTranslations("User");

  return (
    <div className={`section ${styles.userOrders} ${styles[deviceType]}`}>
      <h3 className={styles.title}>{t("your_orders")}</h3>
      <div className={styles.tableWrapper}>
        {orders.length < 1 ? (
          <p className={styles.noOrders}>{t("no_orders")}</p>
        ) : deviceType === "desktop" ? (
          orders.map((order, index) => (
            <div key={index} className={styles.orderCard}>
              <h3>
                {t("date")}: {new Date(order.createdAt).toLocaleString("hr-HR")}
              </h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t("image")}</th>
                    <th>{t("product")}</th>
                    <th>{t("quantity")}</th>
                    <th>{t("price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} width={50} />
                        ) : (
                          <span className={styles.noImage}>No image</span>
                        )}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toFixed(2)} €</td>
                    </tr>
                  ))}
                  <tr className={styles.summaryRow}>
                    <td colSpan={3}>{t("subtotal")}:</td>
                    <td>{order.totalPrice} €</td>
                  </tr>
                  <tr className={styles.summaryRow}>
                    <td colSpan={3}>{t("shipping")}:</td>
                    <td>{order.shippingCost} €</td>
                  </tr>
                  <tr className={styles.summaryRow}>
                    <td colSpan={3}>{t("total")}:</td>
                    <td>{order.finalPrice} €</td>
                  </tr>
                  <tr className={styles.summaryRow}>
                    <td colSpan={3}>{t("status")}:</td>
                    <td>{order.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        ) : (
          orders.map((order, index) => (
            <div key={index} className={styles.mobileOrderCard}>
              <p>
                <strong>{t("date")}:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("hr-HR")}
              </p>
              <p>
                <strong>{t("products")}:</strong>
              </p>
              <ul className={styles.mobileItemList}>
                {order.items.map((item) => (
                  <li key={item._id} className={styles.mobileItem}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} width={50} />
                    ) : (
                      <span className={styles.noImage}>No image</span>
                    )}
                    <div>
                      <p>{item.name}</p>
                      <p>
                        {item.quantity} x {item.price.toFixed(2)} €
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p>
                <strong>{t("subtotal")}:</strong> {order.totalPrice} €
              </p>
              <p>
                <strong>{t("shipping")}:</strong> {order.shippingCost} €
              </p>
              <p>
                <strong>{t("total")}:</strong> {order.finalPrice} €
              </p>
              <p>
                <strong>{t("status")}:</strong> {order.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
