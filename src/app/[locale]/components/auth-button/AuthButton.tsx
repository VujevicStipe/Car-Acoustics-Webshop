"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ButtonComponent from "../button/ButtonComponent";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthButton({ closeMenu }: { closeMenu?: () => void }) {
  const { isAuthenticated, logout } = useAuth();
  const t = useTranslations("Index");
  const router = useRouter();

  if (isAuthenticated === null) {
    return (
      <Link href="/authentication" onClick={closeMenu}>
        <ButtonComponent variant="primary" color="grey">
          {t("login")}
        </ButtonComponent>
      </Link>
    );
  }

  return isAuthenticated ? (
    <>
      <ButtonComponent
        variant="primary"
        color="black"
        onClick={async () => {
          await logout();
          closeMenu?.();
          router.push("/");
        }}
      >
        {t("logOut")}
      </ButtonComponent>
    </>
  ) : (
    <>
      <Link href="/authentication" onClick={closeMenu}>
        <ButtonComponent variant="primary" color="orange">
          {t("login")}
        </ButtonComponent>
      </Link>
    </>
  );
}
