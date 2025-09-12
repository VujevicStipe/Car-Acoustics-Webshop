export async function addProduct(productData: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/product`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Greška u slanju");

    return result;
  } catch (error) {
    console.error("Greška pri dodavanju proizvoda:", error);
    throw error;
  }
}
