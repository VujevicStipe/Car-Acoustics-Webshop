"use client";
import React, { useEffect, useState } from "react";
import styles from "./UserPageContainer.module.css";
import useDeviceType from "@/app/hooks/useWindowSize";
import getUser from "@/app/lib/getUser";
import UserOrdersTable from "../../user-page/components/user-orders-table/UserOrdersTable";
import UserInfo from "../../user-page/components/user-info/UserInfo";
import { useTranslations } from "next-intl";
import { toggleWishlist } from "@/app/lib/wishlist";
import { toast } from "sonner";
import WishlistItems from "../../components/wishlist-items/WishlistItems";

const UserPageContainer = () => {
  const deviceType = useDeviceType();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("User");
  const tOrder = useTranslations("Order");
  const tWish = useTranslations("Wishlist");

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">("wishlist");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      try {
        const data = await getUser();
        if (data?.user) {
          setUser(data.user);
          setOrders(data.orders || []);
        } else {
          setUser(null);
          setOrders([]);
        }
      } catch (err: any) {
        setError(err.message || "Greška pri učitavanju korisnika");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoadingWishlist(true);
      try {
        const res = await fetch("/api/wishlist");
        if (!res.ok) throw new Error(tWish("errorLoadingWishlist"));
        const data: WishlistItem[] = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
      } catch {
        toast(tWish("errorLoadingWishlist"));
        setWishlist([]);
      } finally {
        setLoadingWishlist(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId, wishlist, setWishlist);
  };

  if (loadingUser) return <div className="loading">{t("loading_profile")}</div>;
  if (error)
    return (
      <div
        className="loading"
        style={{ color: "red", padding: "1rem", textAlign: "center" }}
      >
        {error}
      </div>
    );
  if (!user) return null;

  return (
    <div
      className={`container ${styles.userPageContainer} ${styles[deviceType]}`}
    >
      <UserInfo user={user} />

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "wishlist" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("wishlist")}
        >
          {tWish("wishlist")}
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "orders" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          {tOrder("orders")}
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "orders" ? (
          <>
            <UserOrdersTable orders={orders} />
          </>
        ) : (
          <>
            <WishlistItems
              loading={loadingWishlist}
              items={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserPageContainer;
