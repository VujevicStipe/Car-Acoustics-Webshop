export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Greška u uploadu slike");
  }

  const data = await res.json();
  return data.secure_url;
};
