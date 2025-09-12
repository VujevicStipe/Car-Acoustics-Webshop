"use client";
import React from "react";
import styles from "./FooterComponent.module.css";
import footerLogo from "@/public/footer_logo.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useDeviceType from "@/app/hooks/useWindowSize";

export default function FooterComponent() {
  const t = useTranslations("Index");
  const deviceType = useDeviceType();

  return (
    <div className={`${styles.footerStyle} ${styles[deviceType]}`}>
      <div className={styles.logo}>
        <Image
          className={styles.logoImage}
          src={footerLogo}
          alt="footer-logo"
        />
        <div className={styles.icons}></div>
      </div>
      <div className={styles.content}>
        <h2>{t("footer-01")}</h2>
        <div className={styles.line}></div>
        <h3 className={styles.paragpraph}>{t("footer-02")}</h3>
      </div>
      <p className={styles.cpyright}>all right reserved 2023</p>
    </div>
  );
}
