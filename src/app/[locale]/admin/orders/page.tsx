"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OrdersTable from "./components/OrdersTable";
import styles from "./OrdersAdmin.module.css";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Order");

  const searchFromUrl = searchParams.get("search") || "";
  const statusFromUrl = searchParams.get("status") || "";
  const [search, setSearch] = useState(searchFromUrl);
  const [status, setStatus] = useState(statusFromUrl);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrlParam("search", search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    updateUrlParam("status", status);
  }, [status]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);

        const url = `/api/orders?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [searchParams]);

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((order) => order._id !== id));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("Greška pri ažuriranju statusa narudžbe.");
    }
  };

  if (!orders) return;
  if (loading) return <div className="loading">{t("loading")}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("ordersTitle")}</h1>
      <div className={styles.wrapper}>
        <input
          type="search"
          placeholder={t("searchOrders")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select"
        >
          <option value="">{t("all_statuses")}</option>
          <option value="processing">{t("status_processing")}</option>
          <option value="sent">{t("status_sent")}</option>
          <option value="completed">{t("status_completed")}</option>
        </select>
      </div>
      <OrdersTable
        onStatusChange={handleStatusChange}
        orders={orders}
        onDelete={handleDelete}
      />
    </div>
  );
}
