"use client";
import { useRouter, usePathname, useParams } from "next/navigation";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams() as { locale: string };

  const toggleLocale = () => {
    const newLocale = locale === "hr" ? "en" : "hr";
    const newPath = `/${newLocale}${pathname.replace(/^\/(hr|en)/, "")}`;
    router.push(newPath);
  };

  return (
    <div className={styles.switchWrapper} onClick={toggleLocale}>
      {/* Animated slider (the moving thumb) */}
      <motion.div
        className={styles.slider}
        animate={{ left: locale === "hr" ? 4 : 90 - 44 - 4 }} // 90 width - slider width - padding
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <ReactCountryFlag
          countryCode={locale === "hr" ? "HR" : "GB"}
          svg
          style={{ width: "24px", height: "24px" }}
        />
      </motion.div>

      {/* Static background flags */}
      <div className={styles.flags}>
        <ReactCountryFlag
          countryCode="HR"
          svg
          style={{ width: "24px", height: "24px" }}
        />
        <ReactCountryFlag
          countryCode="GB"
          svg
          style={{ width: "24px", height: "24px" }}
        />
      </div>
    </div>
  );
}
