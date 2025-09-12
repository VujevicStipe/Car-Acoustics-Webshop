"use client";
import { useEffect, useState } from "react";
import styles from "./ProductForm.module.css";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";
import { addProduct } from "@/app/lib/addProduct";
import { Category, categorySpecs, specOptions } from "@/app/lib/categorySpecs";
import { useTranslations } from "next-intl";
import { uploadImage } from "@/app/lib/uploadImage";
import { updateProduct } from "@/app/lib/updateProduct";
import { toast } from "sonner";

type ProductFormProps = {
  product?: Product;
  mode: "create" | "edit";
  initialData?: any;
};

export default function ProductForm({
  // product,
  mode,
  initialData,
}: ProductFormProps) {
  const t = useTranslations("ProductForm");

  const [category, setCategory] = useState<Category | "">("");
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    {}
  );
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setCategory(initialData.category);
      setSpecifications(initialData.specs || {});
    }
  }, [initialData, mode]);

  const handleSpecChange = (key: string, value: string) => {
    setSpecifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("onlyImagesAllowed"));
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget as HTMLFormElement);

    let imageUrl = initialData?.imageUrl || "";
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (err) {
        console.error("Greška u uploadu slike", err);
        toast.error(t("imageUploadError"));
        return;
      }
    }

    const data = {
      name: form.get("name"),
      brand: form.get("brand"),
      model: form.get("model"),
      price: form.get("price"),
      description: form.get("description"),
      category,
      imageUrl,
      specs: specifications,
      stock: form.get("stock"),
    };

    const role = localStorage.getItem("role");
    if (role !== "admin") {
      console.error("Korisnik nije prijavljen!");
      toast.error(t("admin_error"));
      return;
    }

    try {
      if (mode === "create") {
        await addProduct(data);
        toast.success(t("productAdded"));
      } else if (mode === "edit" && initialData?._id) {
        await updateProduct(initialData._id, data);
        toast.success(t("productUpdated"));
      }
    } catch (err) {
      console.error("Greška pri spremanju proizvoda:", err);
      toast.error(t("saveError"));
    }
  };

  const specFields = categorySpecs[category as Category] || [];

  return (
    <div className={styles.addProductForm}>
      <form
        className={`${styles.form} ${styles.horizontalForm}`}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.title}>
          {t(mode === "create" ? "addProduct" : "editProduct")}
        </h2>

        <input
          name="name"
          placeholder={t("productName")}
          defaultValue={initialData?.name || ""}
          required
        />
        <select name="brand" defaultValue={initialData?.brand || ""} required>
          <option value="">{t("select_brand")}</option>
          {specOptions["brand"]?.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        <input
          name="model"
          placeholder={t("model")}
          defaultValue={initialData?.model || ""}
          required
        />
        <input
          name="price"
          placeholder={t("productPrice")}
          type="number"
          step="0.01"
          defaultValue={initialData?.price || ""}
          required
        />
        <textarea
          name="description"
          placeholder={t("productDescription")}
          defaultValue={initialData?.description || ""}
          required
        />
        <input
          name="stock"
          placeholder={t("productStock")}
          type="number"
          step="1"
          defaultValue={initialData?.stock || ""}
          required
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category);
            setSpecifications({});
          }}
          required
        >
          <option value="">{t("selectCategory")}</option>
          <option value="speaker">{t("speaker")}</option>
          <option value="amplifier">{t("amplifier")}</option>
          <option value="player">{t("radio")}</option>
          <option value="accessories">{t("accessory")}</option>
        </select>

        {specFields.map((spec) => {
          const options = specOptions[spec.key];
          if (options) {
            return (
              <select
                key={spec.key}
                value={specifications[spec.key] || ""}
                onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                required
              >
                <option value="">
                  {t(`select_${spec.key}`) || `Odaberi ${spec.label}`}
                </option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          }

          return (
            <input
              key={spec.key}
              placeholder={t(spec.key)}
              value={specifications[spec.key] || ""}
              onChange={(e) => handleSpecChange(spec.key, e.target.value)}
            />
          );
        })}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required={mode === "create"}
        />

        <ButtonComponent variant="primary" color="black">
          {t(mode === "create" ? "add" : "save")}
        </ButtonComponent>
      </form>
    </div>
  );
}
