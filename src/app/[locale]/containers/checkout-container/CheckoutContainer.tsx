"use client";
import React, { useEffect, useState } from "react";
import styles from "./CheckoutContainer.module.css";
import OrderForm from "../../checkout/components/order-form/OrderForm";
import CartInfoComponent from "../../shopping-cart/components/cart-info/CartInfoComponent";
import useDeviceType from "@/app/hooks/useWindowSize";

export default function CheckoutContainer() {
  const deviceType = useDeviceType();
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("order");
    if (data) {
      try {
        const parsed: CartItem[] = JSON.parse(data);
        setCartProducts(parsed);
      } catch (error) {
        console.error("Greška pri parsiranju podataka iz localStorage", error);
      }
    }
  }, []);

  const totalPrice = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`container ${styles.checkoutContainer} ${styles[deviceType]}`}
    >
      <OrderForm mode="create" />
      <CartInfoComponent price={totalPrice} />
    </div>
  );
}
