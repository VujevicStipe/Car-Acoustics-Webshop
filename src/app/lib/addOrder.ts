export async function addOrder(orderData: any) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Greška u slanju narudžbe");
  }

  return res.json();
}
