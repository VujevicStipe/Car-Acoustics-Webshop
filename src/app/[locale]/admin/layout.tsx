"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import { useTranslations } from "next-intl";
import AuthButton from "../components/auth-button/AuthButton";
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/products", label: t("products"), icon: <FaBoxOpen /> },
    { href: "/admin/users", label: t("users"), icon: <FaUsers /> },
    { href: "/admin/orders", label: t("orders"), icon: <FaShoppingCart /> },
    { href: "/admin/analitics", label: t("analitics"), icon: <FaChartLine /> },
  ];

  const isActive = (href: string) => {
    const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");
    return (
      pathWithoutLocale === href || pathWithoutLocale.startsWith(href + "/")
    );
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? styles.active : ""}
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <AuthButton />
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
