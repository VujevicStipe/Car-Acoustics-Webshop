export async function getProducts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/product`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok)
      throw new Error(result.error || "Greška u dohvaćanju proizvoda");

    return result;
  } catch (error) {
    console.error("Greška pri dohvaćanju proizvoda:", error);
    throw error;
  }
}
