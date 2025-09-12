"use client";
import { useTranslations } from "next-intl";
import styles from "./ChangePassword.module.css";
import ChangePasswordFormComponent from "./components/change-password-form/ChangePasswordFormComponent";

export default function ChangePasswordPage() {
  const t = useTranslations("Index")
  return (
    <div className={`container ${styles.changePasswordContainer}`}>
      <h1>{t("changePassword")}</h1>
      <ChangePasswordFormComponent />
    </div>
  );
}
