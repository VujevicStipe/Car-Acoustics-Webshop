"use client";

import React, { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import logo from "@/public/LoudSystemsLogo.svg";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import useDeviceType from "@/app/hooks/useWindowSize";
import { useTranslations } from "next-intl";
import { ShoppingCart, User } from "lucide-react";
import AuthButton from "../auth-button/AuthButton";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../language-switcher/LanguageSwitcher";

export default function NavBar() {
  const deviceType = useDeviceType();
  const t = useTranslations("Index");
  const tUser = useTranslations("User");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      const cart = localStorage.getItem("order");
      setCartCount(cart ? JSON.parse(cart).length : 0);
    }

    updateCount();
    window.addEventListener("cartUpdated", updateCount);

    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    closeMenu();

    if (!isAuthenticated) {
      toast.error(tUser("unauthorised"));
      router.push("/authentication");
    } else {
      router.push("/user-page");
    }
  };

  return (
    <>
      <div className={`${styles.navBar} ${menuOpen ? styles.fixed : ""}`}>
        <Link href="/" onClick={closeMenu}>
          <Image className={styles.logo} src={logo} alt="logo" />
        </Link>

        {deviceType === "desktop" ? (
          <>
            <ul className={styles.navLinks}>
              <li>
                <Link href="/shop?category=speaker" onClick={closeMenu}>
                  {t("cat-01")}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=amplifier" onClick={closeMenu}>
                  {t("cat-02")}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=player" onClick={closeMenu}>
                  {t("cat-03")}
                </Link>
              </li>
              <li>
                <Link href="/shop" onClick={closeMenu}>
                  {t("cat-04")}
                </Link>
              </li>
            </ul>
            <ul className={styles.authLinks}>
              <Link href="/shopping-cart" style={{ position: "relative" }}>
                <ShoppingCart size={20} style={{ marginLeft: "0.5rem" }} />
                {cartCount > 0 && (
                  <span className="cartBadge">{cartCount}</span>
                )}
              </Link>
              <Link href="/user-page" onClick={handleClick}>
                <User size={20} style={{ marginLeft: "0.5rem" }} />
              </Link>
              <LanguageSwitcher />
              <AuthButton />
            </ul>
          </>
        ) : (
          <div className={styles.burgerMenu} onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        )}
      </div>

      {menuOpen && deviceType !== "desktop" && (
        <div className={styles.mobileMenu}>
          <ul>
            <li>
              <Link href="/shop?category=speaker" onClick={closeMenu}>
                {t("cat-01")}
              </Link>
            </li>
            <li>
              <Link href="/shop?category=amplifier" onClick={closeMenu}>
                {t("cat-02")}
              </Link>
            </li>
            <li>
              <Link href="/shop?category=player" onClick={closeMenu}>
                {t("cat-03")}
              </Link>
            </li>
            <li>
              <Link href="/shop" onClick={closeMenu}>
                {t("cat-04")}
              </Link>
            </li>
            <li className={`${styles.authLinks} ${styles.leftMenuDisplay}`}>
              <AuthButton />
              <Link href="/user-page" onClick={handleClick}>
                <User size={20} style={{ marginLeft: "0.5rem" }} />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
