"use client";

import { useEffect, useState } from "react";
import styles from "./UsersAdmin.module.css";
import UsersTable from "./components/UsersTable";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AdminUsersPage() {
  const t = useTranslations("User");
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchFromUrl = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchFromUrl);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrlParam("search", search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const url = `/api/users?${searchParams.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams]);

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((user) => user._id !== id));
  };

  if (loading) return <div className="loading">{t("loading_profile")}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("title")}</h1>
      <div className={styles.wrapper}>
        <input
          type="search"
          placeholder={t("searchUsers")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>
      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <UsersTable users={users} onDelete={handleDelete} />
      )}
    </div>
  );
}
