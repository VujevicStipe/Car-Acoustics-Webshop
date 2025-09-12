import React from "react";
import styles from "./UserInfo.module.css";
import useDeviceType from "@/app/hooks/useWindowSize";
import { useTranslations } from "next-intl";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import { useRouter } from "next/navigation";

interface UserInfoProps {
  user: UserData;
}

export default function UserInfo({ user }: UserInfoProps) {
  const deviceType = useDeviceType();
  const t = useTranslations("User");
  const tIndex = useTranslations("Index");

  const router = useRouter();

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  return (
    <div className={`section ${styles.userInfo} ${styles[deviceType]}`}>
      {deviceType === "mobile" ? (
        <div className={styles.userInfoMobile}>
          <div className={styles.content}>
            <div className={styles.userAvatar}>
              <div className={styles.userImg}>
                {user.username ? user.username[0].toUpperCase() : "?"}
              </div>
            </div>
            <h2 className={styles.title}>
              {t("greeting")},{" "}
              <span className={styles.username}>{user.username}!</span>
            </h2>
            <h2 className={styles.generalInfoTitle}>General information</h2>
            <div className={styles.generalInfo}>
              <p className={styles.userGenerals}>
                <span className={styles.label}>e-mail</span>
                <span className={styles.emailField}>{user.email}</span>
              </p>
              <ButtonComponent
                variant="primary"
                color="red"
                onClick={handleChangePassword}
              >
                {tIndex("changePassword")}
              </ButtonComponent>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.userAvatar}>
            <div className={styles.userImg}>
              {user.username ? user.username[0].toUpperCase() : "?"}
            </div>
          </div>
          <div className={styles.content}>
            <h2 className={styles.title}>
              {t("greeting")},{" "}
              <span className={styles.username}>{user.username}!</span>
            </h2>
            <h2 className={styles.generalInfoTitle}>General information</h2>
            <div className={styles.generalInfo}>
              <p className={styles.userGenerals}>
                <span className={styles.label}>e-mail</span>
                <span className={styles.emailField}>{user.email}</span>
              </p>
              <ButtonComponent
                variant="primary"
                color="red"
                onClick={handleChangePassword}
              >
                {tIndex("changePassword")}
              </ButtonComponent>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
