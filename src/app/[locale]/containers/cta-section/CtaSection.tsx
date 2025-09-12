"use client";
import React from "react";
import styles from "./CtaSection.module.css";
import "@/styles/globals.css";
import Image from "next/image";
import useDeviceType from "@/app/hooks/useWindowSize";
import ButtonComponent from "../../components/button/ButtonComponent";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CtaSection() {
  const t = useTranslations("Index");
  const deviceType = useDeviceType();

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`section ${styles.ctaSection} ${styles[deviceType]}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className={styles.bgTexture}></div>
      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className={styles.text} variants={itemVariants}>
          <motion.h2
            className={`heading2 ${styles.heading2}`}
            variants={itemVariants}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {t("cta-01")}
          </motion.h2>
          <motion.div
            className={styles.line}
            variants={itemVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
          ></motion.div>
          <motion.p
            className={`paragraph ${styles.paragraph}`}
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {t("cta-02")}
          </motion.p>
          <Link href="/shop">
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <ButtonComponent variant="primary" color="orange">
                {t("shop-btn")}
              </ButtonComponent>
            </motion.div>
          </Link>
        </motion.div>
        <motion.div
          className={styles.image}
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image src="/speakerCTA.png" alt="speaker" width={300} height={300} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
