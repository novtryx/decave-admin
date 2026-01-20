"use server"
import { protectedFetch } from "@/lib/protectedFetch";

export async function uploadImage(
  image: File
) {
  const res = await protectedFetch<{ message: string, success: boolean, data: any }>("/upload/image", {
    method: "POST",
    body:{image: image}
  });
  return res;
}