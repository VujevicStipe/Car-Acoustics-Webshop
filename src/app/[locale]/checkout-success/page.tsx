"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./CheckoutSuccess.module.css";
import ButtonComponent from "../components/button/ButtonComponent";
import Link from "next/link";
import dispatchCartUpdated from "@/app/lib/addToCart";
import { useTranslations } from "next-intl";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [message, setMessage] = useState("Provjera plaćanja...");
  const t = useTranslations("Order");

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `/api/verify-checkout-session?session_id=${sessionId}`
        );
        const data = await res.json();

        if (data.success) {
          localStorage.removeItem("order");
          dispatchCartUpdated();
          setMessage(t("payment_success"));
        } else {
          setMessage(t("payment_faied"));
        }
      } catch (err) {
        console.error(err);
        setMessage(
          "Došlo je do greške prilikom provjere plaćanja. Pokušajte kasnije."
        );
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className={`container ${styles.success} `}>
      <div className={styles.wrapper}>
        <p className={styles.paragraph}>{message}</p>
        <Link href="/shop">
          <ButtonComponent variant="primary" color="orange">
            Povratak na kupovinu
          </ButtonComponent>
        </Link>
      </div>
    </div>
  );
}
