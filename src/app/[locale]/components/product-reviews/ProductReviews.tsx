"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/context/AuthContext";
import styles from './ProductReviews.module.css'
import { FaTrash } from "react-icons/fa";

type ReviewsTableProps = {
  reviews: Review[];
  onDelete: (id: string) => void;
};

export default function ProductReviews({
  reviews,
  onDelete,
}: ReviewsTableProps) {
  const t = useTranslations("Reviews");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("deleteError"));
      }
      onDelete(id);
      toast.success(t("deleteSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.reviewList}>
      {(Array.isArray(reviews) ? reviews : []).map((review) => {
        const isAuthor = review.user?._id === user?._id;
        const isAdmin = user?.role === "admin";
        return (
          <div className={styles.reviewCard} key={review._id}>
            <div className={styles.header}>
              <div className={styles.avatar}>
                {review.user?.username
                  ? review.user.username[0].toUpperCase()
                  : "?"}
              </div>
              <div>
                <div className={styles.username}>
                  {review.user?.username || t("anonymous")}
                </div>
                <div className={styles.date}>
                  {new Date(review.createdAt).toLocaleString()}
                </div>
              </div>
              {(isAuthor || isAdmin) && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(review._id)}
                  disabled={deletingId === review._id}
                >
                  {/* {deletingId === review._id ? t("deleting") : t("delete")} */}
                  <FaTrash />
                </button>
              )}
            </div>
            <div className={styles.rating}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`${styles.star} ${
                    n <= review.rating ? styles.starFilled : ""
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className={styles.comment}>{review.comment}</div>
          </div>
        );
      })}
      {(!reviews || reviews.length === 0) && (
        <div className={styles.noReviews}>{t("noReviews")}</div>
      )}
    </div>
  );
}
