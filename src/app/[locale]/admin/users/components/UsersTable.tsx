import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import styles from "./UsersTable.module.css";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useState } from "react";

interface UsersTableProps {
  users: UserData[];
  onDelete: (id: string) => void;
}

export default function UsersTable({ users, onDelete }: UsersTableProps) {
  const t = useTranslations("User");
  const [, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("deleteError"));
      }

      onDelete(id);
      toast.success(t("deleteSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{t("username")}</th>
          <th>{t("email")}</th>
          <th>{t("role")}</th>
          <th>{t("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <Link href={`/admin/users/edit/${user._id}`}>
                <ButtonComponent variant="tertiary" color="green">
                  <FaEdit />
                </ButtonComponent>
              </Link>
              <ButtonComponent
                variant="tertiary"
                color="red"
                onClick={() => handleDelete(user._id)}
              >
                <FaTrash />
              </ButtonComponent>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
