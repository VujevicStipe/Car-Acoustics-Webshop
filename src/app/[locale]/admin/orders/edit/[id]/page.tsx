"use client";

import OrderForm from "@/app/[locale]/checkout/components/order-form/OrderForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          throw new Error("Greška pri dohvaćanju narudžbe");
        }
        const data = await response.json();
        setOrder(data);
      } catch {
        setError("Greška pri dohvaćanju narudžbe");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Narudžba nije pronađena</p>;

  return <OrderForm mode="edit" initialData={order} />;
}
