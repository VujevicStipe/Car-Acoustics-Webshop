"use client";

import React, { useEffect, useState } from "react";
import styles from "./ShoppingCartContainer.module.css";
import CartItemCard from "../../shopping-cart/components/cart-item-card/CartItemCard";
import CartInfoComponent from "../../shopping-cart/components/cart-info/CartInfoComponent";
import useDeviceType from "@/app/hooks/useWindowSize";
import ButtonComponent from "../../components/button/ButtonComponent";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { removeFromCart } from "@/app/lib/addToCart";

export default function ShoppingCartContainer() {
  const deviceType = useDeviceType();
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const t = useTranslations("Order");

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
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    const updatedCart = cartProducts.map((item) => {
      if (item._id === id) {
        if (newQuantity > item.stock) {
          toast.error(`${t("lowStock")} ${item.stock} ${t("lowStock2")}`);
          return { ...item, quantity: item.stock };
        } else if (newQuantity < 1) {
          return { ...item, quantity: 1 };
        } else {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });

    setCartProducts(updatedCart);
    localStorage.setItem("order", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    const updatedCart = cartProducts.filter((item) => item._id !== id);
    setCartProducts(updatedCart);
  };

  const totalPrice = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isCheckoutEnabled = cartProducts.length > 0;

  return (
    <div className={`container ${styles.shoppingCart} ${styles[deviceType]}`}>
      {cartProducts.length === 0 ? (
        <p>Košarica je prazna.</p>
      ) : (
        <ul className={styles.cartItemsList}>
          {cartProducts.map((cartProduct) => (
            <li className={styles.cartItem} key={cartProduct._id}>
              <CartItemCard
                item={cartProduct}
                onQuantityChange={updateQuantity}
                onRemove={handleRemoveItem}
              />
            </li>
          ))}
        </ul>
      )}
      <div className={styles.wrapper}>
        <CartInfoComponent price={totalPrice} />
        <Link
          className={styles.checkoutLink}
          href={isCheckoutEnabled ? "/checkout" : "#"}
          onClick={(e) => {
            if (!isCheckoutEnabled) {
              e.preventDefault();
              toast.error(t("emptyCart"));
            } else if (!isAuthenticated) {
              e.preventDefault();
              toast.error(t("loginFirst"));
            }
          }}
        >
          <ButtonComponent variant="primary" color="orange">
            {t("checkout")}
          </ButtonComponent>
        </Link>
      </div>
    </div>
  );
}
