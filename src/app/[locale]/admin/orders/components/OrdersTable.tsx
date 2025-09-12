"use client";

import { useState } from "react";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import styles from "./OrdersTable.module.css";
import { FaTrash } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface AdminOrdersTableProps {
  orders: Order[];
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function AdminOrdersTable({
  orders,
  onStatusChange,
  onDelete,
}: AdminOrdersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const t = useTranslations("Order");

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await onStatusChange(id, status);
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
      alert("Greška pri ažuriranju statusa.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{t("firstName")}</th>
          <th>{t("lastName")}</th>
          <th>{t("email")}</th>
          <th>{t("city")}</th>
          <th>{t("finalPrice")}</th>
          <th>{t("isPaid")}</th>
          <th>{t("paymentType")}</th>
          <th>{t("createdAt")}</th>
          <th>{t("products")}</th>
          <th>{t("status")}</th>
          <th>{t("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td>{order.firstName}</td>
            <td>{order.lastName}</td>
            <td>{order.email}</td>
            <td>{order.city}</td>
            <td>{order.finalPrice}€</td>
            <td>{order.isPaid ? t("yes") : t("no")}</td>
            <td>{order.paymentType === "cash" ? t("cash") : t("card")}</td>
            <td>
              {new Date(order.createdAt).toLocaleDateString("hr-HR", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
            <td>
              <ul style={{ paddingLeft: 16, margin: 0, listStyle: "none" }}>
                {order.items.map((item) => (
                  <li key={item._id} style={{ marginBottom: 4 }}>
                    {item.name} - {item.price}€
                  </li>
                ))}
              </ul>
            </td>
            <td>
              <select
                disabled={updatingId === order._id}
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="select"
              >
                <option value="processing">{t("status_processing")}</option>
                <option value="sent">{t("status_sent")}</option>
                <option value="completed">{t("status_completed")}</option>
              </select>
            </td>
            <td>
              <ButtonComponent
                variant="tertiary"
                color="red"
                onClick={() => {
                  if (
                    confirm("Jesi li siguran da želiš obrisati ovu narudžbu?")
                  ) {
                    onDelete(order._id);
                  }
                }}
              >
                <FaTrash />
              </ButtonComponent>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
