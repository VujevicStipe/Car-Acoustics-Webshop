"use client";
import styles from "./AuthenticationPageSections.module.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import AuthenticationModalComponent from "../authentication-modal/AuthenticationModalComponent";
import SnackBarComponent from "@/app/[locale]/components/snack-bar/SnackBarComponent";
import LoginForm from "@/app/[locale]/components/login-form/LoginForm";
import DialogComponent from "@/app/[locale]/components/dialog/DialogComponent";

const AuthenticationPageSection = () => {
  const t = useTranslations("Index");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);

  const closeDialog = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);

  return (
    <>
      <section className={styles.landing_section}>
        <div className={styles.landing_section__filter}></div>
        <h3>{t("title")}</h3>
        <DialogComponent>
          <LoginForm
            setFailedLogin={() => setFailedLogin(true)}
            setIsModalOpen={() => setIsModalOpen(true)}
          />
        </DialogComponent>
        {/* <LoginForm
          setIsModalOpen={() => setIsModalOpen(true)}
          setFailedLogin={() => setFailedLogin(true)}
        /> */}
      </section>
      {isModalOpen && (
        <AuthenticationModalComponent closeDialog={closeDialog} />
      )}
      {failedLogin && (
        <SnackBarComponent
          variant={"error"}
          onClick={() => setFailedLogin(false)}
        >
          <p>{t("loginError")}</p>
        </SnackBarComponent>
      )}
    </>
  );
};

export default AuthenticationPageSection;
