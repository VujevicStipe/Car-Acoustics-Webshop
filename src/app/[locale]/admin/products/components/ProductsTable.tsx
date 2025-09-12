import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import styles from "./ProductsTable.module.css";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useState } from "react";

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductsTable({
  products,
  onDelete,
}: ProductsTableProps) {
  const t = useTranslations("ProductForm");
  const [, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    console.log("Brisanje proizvoda s ID:", id);
    if (!confirm(t("confirmDelete"))) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
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
          <th>{t("productName")}</th>
          <th>{t("brand")}</th>
          <th>{t("model")}</th>
          <th>{t("productPrice")}</th>
          <th>{t("productStock")}</th>
          <th>{t("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>{product.name}</td>
            <td>{product.brand}</td>
            <td>{product.model}</td>
            <td>{product.price}€</td>
            <td>{product.stock}</td>
            <td>
              <Link href={`/admin/products/edit/${product._id}`}>
                <ButtonComponent variant="tertiary" color="green">
                  <FaEdit />
                </ButtonComponent>
              </Link>
              <ButtonComponent
                variant="tertiary"
                color="red"
                onClick={() => handleDelete(product._id)}
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
