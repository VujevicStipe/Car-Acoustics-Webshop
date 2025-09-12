"use client";
import React from "react";
import styles from "./HeroSection.module.css";
import Image from "next/image";
import hero1 from "@/public/hero1.svg"; // car
import hero2 from "@/public/hero2.svg"; // tiger
import "../../../styles/globals.css";
import useDeviceType from "@/app/hooks/useWindowSize";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function HeroSection() {
  const deviceType = useDeviceType();
  const t = useTranslations("Index");

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -150 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className={`section ${styles.container} ${styles[deviceType]}`}>
      <div className={styles.bgTexture}>
        <svg
          viewBox="0 0 2953 1435"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M2234.98 636.9C2627.36 535.271 2876.68 169.954 2952.29 0V1434.31H0C112.419 1354.77 455.384 1143.84 927.888 936.466C1518.52 677.243 1744.5 763.936 2234.98 636.9Z"
            fill="#FFA600"
          />
        </svg>
      </div>

      <motion.div
        className={styles.content}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className={styles.heroImg1}
          variants={slideInLeft}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <Image src={hero1} alt="car" priority />
        </motion.div>

        <motion.div
          className={styles.heroImg2}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Image src={hero2} alt="tiger" priority />
        </motion.div>

        <motion.div
          className={`title ${styles.title}`}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <h1>
            {t("hero-text-1")}
            <br />
            {t("hero-text-2")}
          </h1>
        </motion.div>
      </motion.div>
    </div>
  );
}
