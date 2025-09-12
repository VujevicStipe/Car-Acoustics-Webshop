"use client";
import { useTranslations } from "next-intl";
import styles from "./AuthenticationModalComponent.module.css";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import DialogComponent from "@/app/[locale]/components/dialog/DialogComponent";
import SnackBarComponent from "@/app/[locale]/components/snack-bar/SnackBarComponent";
import RegistrationForm from "@/app/[locale]/components/registration-form/RegistrationForm";

interface AuthenticationModalComponentProps {
  closeDialog: () => void;
}

const AuthenticationModalComponent: React.FC<
  AuthenticationModalComponentProps
> = ({ closeDialog }) => {
  const t = useTranslations("Index");
  const [successful, setSuccessful] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      <DialogComponent closeDialog={closeDialog}>
        <div className={styles.authentication_modal}>
          <div className={styles.authentication_header}>
            <h2>{t("registerTitle")}</h2>
            <IoMdClose
              size={36}
              className={styles.close_button}
              onClick={closeDialog}
            />
          </div>
          <RegistrationForm
            setSuccessful={(value: boolean) => setSuccessful(value)}
            setError={(value: boolean) => setError(value)}
          />
        </div>
      </DialogComponent>
      {successful && (
        <SnackBarComponent
          onClick={() => setSuccessful(false)}
          variant={"successful"}
        >
          {<p>{t("successfulRegisterMessage")}</p>}
        </SnackBarComponent>
      )}
      {error && (
        <SnackBarComponent onClick={() => setError(false)} variant={"error"}>
          {<p>{t("errorRegisterMessage")}</p>}
        </SnackBarComponent>
      )}
    </>
  );
};

export default AuthenticationModalComponent;
