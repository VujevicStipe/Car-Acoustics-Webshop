"use client";

import { useState } from "react";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import styles from "./UserEditForm.module.css";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface UserEditFormProps {
  user: UserData;
}

export default function UserEditForm({ user }: UserEditFormProps) {
  const t = useTranslations("User");

  const [formData, setFormData] = useState<UserData>(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/users/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      toast.success(t("userUpdated"));
    } catch (error) {
      console.error(error);
      toast.error(t("saveError"));
    }
  };

  return (
    <div className={styles.addProductForm}>
      <form
        className={`${styles.form} ${styles.horizontalForm}`}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.title}>{t("editUser")}</h2>

        <input
          name="username"
          placeholder={t("username")}
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder={t("email")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="user">{t("roleUser")}</option>
          <option value="admin">{t("roleAdmin")}</option>
        </select>

        <ButtonComponent variant="primary" color="black">
          {t("save")}
        </ButtonComponent>
      </form>
    </div>
  );
}
