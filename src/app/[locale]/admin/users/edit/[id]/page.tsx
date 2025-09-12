"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import UserEditForm from "@/app/[locale]/components/user-edit-form/UserEditForm";

export default function EditUserPage() {
  const { id } = useParams();
  const t = useTranslations("User");

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Greška pri dohvaćanju korisnika");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Greška:", err);
        alert(t("fetchError"));
        setError("Greška pri dohvaćanju proizvoda");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Proizvod nije pronađen</p>;

  return (
    <div>{user ? <UserEditForm user={user} /> : <p>{t("notFound")}</p>}</div>
  );
}
