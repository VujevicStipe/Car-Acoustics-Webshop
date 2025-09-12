"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import styles from "./OrderForm.module.css";
import { orderFormFields } from "@/app/lib/orderForm";
import { addOrder } from "@/app/lib/addOrder";
import { useRouter } from "next/navigation";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import { z } from "zod";
import { useTranslations } from "next-intl";
import dispatchCartUpdated from "@/app/lib/addToCart";

interface OrderFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Order>;
}

export default function OrderForm({ mode, initialData }: OrderFormProps) {
  const tIndex = useTranslations("Index");
  const tOrder = useTranslations("Order");

  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "Stripe">("cash");
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    orderFormFields.forEach(({ key }) => {
      const value = initialData?.[key as keyof Order];
      initial[key] = value !== undefined && value !== null ? String(value) : "";
    });
    return initial;
  });

  const [errors, setErrors] = useState<{ phone?: string }>({});

  const [cartItems, setCartItems] = useState<CartItem[]>(
    initialData?.items || []
  );

  useEffect(() => {
    const cart = localStorage.getItem("order");
    if (cart) {
      try {
        setCartItems(JSON.parse(cart));
      } catch {
        toast.error(tOrder("cart_load_error"));
      }
    }
  }, []);

  const orderPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = orderPrice >= 50 ? 0 : 4.99;

  const phoneSchema = z
    .string()
    .min(8, { message: tIndex("phone_min") })
    .max(20, { message: tIndex("phone_max") })
    .regex(/^\+?\d[\d\s\-]*$/, { message: tIndex("phone_regex") });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneValue = formData["phone"] || "";
    const validation = phoneSchema.safeParse(phoneValue);

    if (!validation.success) {
      setErrors({ phone: validation.error.errors[0].message });
      return;
    }
    setErrors({});

    if (mode === "create" && !agreed) {
      toast.error(tOrder("accept_terms_error"));
      return;
    }

    const username = localStorage.getItem("username");

    const payload = {
      ...formData,
      username: username,
      items: cartItems,
      totalPrice: orderPrice,
      shippingCost: shippingCost,
      finalPrice: orderPrice + shippingCost,
      paymentType: paymentMethod,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    try {
      if (paymentMethod === "cash") {
        if (mode === "edit" && initialData?._id) {
          const res = await fetch(`/api/orders/${initialData._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(tOrder("order_update_error"));
          toast.success(tOrder("order_update_success"));
        } else {
          await addOrder(payload);
          toast.success(tOrder("order_create_success"));
          localStorage.removeItem("order");
          dispatchCartUpdated();
          router.push("/shop");
        }
      } else {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            metadata: {
              ...formData,
              username,
              paymentType: "Stripe",
              totalPrice: orderPrice,
              shippingCost: shippingCost,
              finalPrice: orderPrice + shippingCost,
            },
          }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else throw new Error("Stripe checkout session failed");
      }
    } catch (err: any) {
      toast.error(err.message || tOrder("order_save_error"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.orderForm} noValidate>
      {orderFormFields.map(({ key, label, type, required }) => (
        <label key={key} className={styles.label}>
          {label}
          <div className={styles.wrapper}>
            <input
              type={type}
              name={key}
              required={required}
              value={formData[key] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className={`${styles.input} ${
                key !== "email" && key !== "phone" ? styles.capitalise : ""
              }`}
            />
            {key === "phone" && errors.phone && (
              <span className="error">{errors.phone}</span>
            )}
          </div>
        </label>
      ))}
      {mode === "create" && (
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          {tOrder("accept_terms_label")}
        </label>
      )}

      {mode === "create" && (
        <div className={styles.paymentOptions}>
          <label className={styles.radioModern}>
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <span className={styles.labelText}>{tOrder("payment_text")}</span>
          </label>

          <label className={styles.radioModern}>
            <input
              type="radio"
              name="payment"
              value="Stripe"
              checked={paymentMethod === "Stripe"}
              onChange={() => setPaymentMethod("Stripe")}
            />
            <span className={styles.labelText}>{tOrder("payment_text2")}</span>
          </label>
        </div>
      )}

      <ButtonComponent variant="primary" color="orange">
        {mode === "edit" ? "Spremi promjene" : "Nastavi na plaćanje"}
      </ButtonComponent>
    </form>
  );
}
