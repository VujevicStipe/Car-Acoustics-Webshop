export default async function registerUser(data: User) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    alert("An error occurred while uploading the file.");
    return null;
  }
}
