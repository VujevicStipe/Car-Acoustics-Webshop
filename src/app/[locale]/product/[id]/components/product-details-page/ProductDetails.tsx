"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./ProductDetails.module.css";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import { useTranslations } from "next-intl";
import ProductSpecsTable from "../product-specs-table/ProductSpecsTable";
import { Category, categorySpecs } from "@/app/lib/categorySpecs";
import useDeviceType from "@/app/hooks/useWindowSize";
import { addToCart } from "@/app/lib/addToCart";
import { toast } from "sonner";
import ReviewForm from "@/app/[locale]/components/review-form/ReviewForm";
import ReviewsTable from "@/app/[locale]/components/product-reviews/ProductReviews";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toggleWishlist } from "@/app/lib/wishlist";
import { AnimatePresence, motion } from "framer-motion";
import { useWishlist } from "@/app/hooks/useWishlist";

const ProductDetails = () => {
  const t = useTranslations("Products");
  const tOrder = useTranslations("Order");
  const tIndex = useTranslations("Index");
  const tWish = useTranslations("Wishlist");
  const tReview = useTranslations("Reviews");

  const deviceType = useDeviceType();
  const { id } = useParams();
  const { wishlist, setWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setError("Greška pri dohvaćanju proizvoda"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    fetch(`/api/reviews?productId=${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [id]);

  const isInWishlist = product
    ? wishlist.some((item) => item.product._id === product._id)
    : false;

  const handleAddToCart = () => {
    if (!product) return;
    const { addedNew } = addToCart(product);
    if (addedNew) toast.success(`${product.name} ${tOrder("add_item_cart")}`);
    else
      toast.error(
        `${product.name} ${
          tOrder("already_in_cart") || "is already in the cart."
        }`
      );
  };

  const handleToggleWishlist = async (productId: string) => {
    const result = await toggleWishlist(productId, wishlist, setWishlist);

    if (result === "added") toast.success(tWish("wishlistSuccess"));
    if (result === "removed") toast.success(tWish("wishlistRemoved"));
    if (result === "error") toast.error(tWish("wishlistFailed"));
  };

  const totalRatings = reviews.length;
  const avgRating =
    totalRatings > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

  const handleReviewAdd = (newReview: any) => {
    setReviews((prev) => [newReview, ...prev]);
  };
  const handleReviewDelete = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  };

  const category = product?.category as Category;
  const fields = categorySpecs[category];

  if (loading)
    return (
      <div className={`loading`}>
        <p>{tIndex("loading")}...</p>
      </div>
    );
  if (error) return <div className="loading">{error}</div>;
  if (!product)
    return <div className="loading">{tOrder("loading_product_failed")}</div>;

  return (
    <div className={`container ${styles.productDetails} ${styles[deviceType]}`}>
      <div className={`${styles.flexWrap} ${styles[deviceType]}`}>
        <div className={styles.imageWrapper}>
          <img
            className={styles.productImg}
            src={product.imageUrl}
            alt={product.name}
          />
        </div>
        <div className={styles.productMainInfo}>
          <h2 className={styles.title}>{product.name}</h2>
          <div className={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={
                  n <= Math.round(avgRating) ? styles.starFilled : styles.star
                }
              >
                ★
              </span>
            ))}
            <span className={styles.ratingText}>
              {avgRating.toFixed(1)} / 5 ({totalRatings})
            </span>
          </div>
          <h3 className={styles.price}>
            {new Intl.NumberFormat("hr-HR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(product.price)}{" "}
            €
          </h3>
          <h4 className={styles.stock}>
            {t("stock")}: {product.stock}
          </h4>
          <div className={styles.line}></div>
          <div className={styles.actions}>
            <ButtonComponent
              variant="primary"
              color="orange"
              onClick={handleAddToCart}
            >
              {tOrder("add_item_btn")}
            </ButtonComponent>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleWishlist(product._id);
              }}
              className={styles.wishlistBtn}
              aria-label="Toggle wishlist"
            >
              {isInWishlist ? (
                <FaHeart size={24} color="red" />
              ) : (
                <FaRegHeart size={24} color="red" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* <div className={styles.contentSection}> */}
      <div className={styles.descriptionSection}>
        <h3>{t("description")}</h3>
        <p className={styles.description}>{product.description}</p>
      </div>
      <div className={styles.tableSpecs}>
        <h3
          className={styles.accordionHeader}
          onClick={() => setIsOpen(!isOpen)}
        >
          {t("specs")}
          <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
        </h3>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="accordion-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }} // 👈 important to hide collapse
            >
              <ProductSpecsTable specs={product.specs} fields={fields} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* </div> */}

      <div className={styles.reviewsSection} style={{ marginTop: 32 }}>
        {reviewsLoading ? (
          <div>{tReview("loading")}</div>
        ) : (
          <ReviewsTable reviews={reviews} onDelete={handleReviewDelete} />
        )}
        <ReviewForm productId={product._id} onSubmitted={handleReviewAdd} />
      </div>
    </div>
  );
};

export default ProductDetails;
