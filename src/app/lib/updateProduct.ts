export async function updateProduct(productId: string, productData: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/products/${productId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productData),
      }
    );

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Greška u ažuriranju");

    return result;
  } catch (error) {
    console.error("Greška pri ažuriranju proizvoda:", error);
    throw error;
  }
}
