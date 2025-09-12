"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import ProductsTable from "./components/ProductsTable";
import ButtonComponent from "../../components/button/ButtonComponent";
import Link from "next/link";
import styles from "./ProductsAdmin.module.css";

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("ProductForm");

  const searchFromUrl = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchFromUrl);
  const [products, setProducts] = useState<Product[]>([]);
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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `/api/product?${searchParams.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((product) => product._id !== id));
  };

  if (loading) return <div className="loading">{t("loading")}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("title")}</h1>
      <div className={styles.wrapper}>
        <input
          type="search"
          placeholder={t("searchProducts")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <Link href="/admin/products/create">
          <ButtonComponent variant="primary" color="orange">
            {t("addProduct")}
          </ButtonComponent>
        </Link>
      </div>

      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <ProductsTable products={products} onDelete={handleDelete} />
      )}
    </div>
  );
}
