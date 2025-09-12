"use client";
import ProductForm from "@/app/[locale]/dashboard/components/products/products-form/ProductForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Greška pri dohvaćanju proizvoda");
        }
        const data = await response.json();
        setProduct(data);
      } catch {
        setError("Greška pri dohvaćanju proizvoda");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Proizvod nije pronađen</p>;

  return <ProductForm mode="edit" initialData={product} />;
}
