export default async function getUser() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/user`
    );

    if (!response.ok) throw new Error(`Can't get user`);

    const data = await response.json();
    console.log("getUser data:", data);
    return data;
  } catch (error) {
    console.error("getUser error:", error);
    return null;
  }
}
