"use client";
import { useState } from "react";
import styles from "./ReviewForm.module.css";
import ButtonComponent from "../button/ButtonComponent";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type Props = {
  productId: string;
  onSubmitted?: (newReview: any) => void;
};

export default function ReviewForm({ productId, onSubmitted }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const t = useTranslations("Reviews");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, rating, comment }),
      credentials: "include",
    });

    if (res.ok) {
      const newReview = await res.json();
      setComment("");
      setRating(5);
      onSubmitted?.(newReview);
    } else if (res.status === 401) {
      toast.error(t("loginFirst"));
    } else {
      const data = await res.json();
      setError(data.error || t("errorPublish"));
    }
    setSubmitting(false);
  };

  function capitalizeSentences(text: string) {
    return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  }

  function handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setComment(capitalizeSentences(value));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>{t("review")}</h3>
      <div className={styles.ratingRow}>
        <label className={styles.label}>{t("rating")}</label>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              className={`${styles.star} ${
                n <= rating ? styles.starFilled : ""
              }`}
              aria-label={`${n} zvjezdica`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setRating(n);
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>{t("comment")}:</label>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          required
          rows={4}
          className={styles.textarea}
          placeholder="Podijelite svoje iskustvo..."
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <ButtonComponent variant="primary" color="orange">
        {submitting ? t("posting") : t("publishReview")}
      </ButtonComponent>
    </form>
  );
}
