"use server";

import { protectedFetch } from "@/lib/protectedFetch";

interface resType{
    success: boolean;
    message: string;
    data: { url: string };
}
export async function uploadImage(file: File): Promise<resType> {
  const formData = new FormData();
  formData.append("image", file); 

  const res = await protectedFetch<resType>("/upload/image", {
    method: "POST",
    body: formData,
  });

  if (!res.success) {
    throw new Error(res.message || "Image upload failed");
  }

  return res;
}
