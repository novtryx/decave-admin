// // app/actions/image-upload.ts
// "use server"

// import { protectedFetch } from "@/lib/protectedFetch";

// export async function uploadImage(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("image", file);

//   // Send formData to Cloudinary / backend image endpoint
//   const res = await protectedFetch<{
//     success: boolean;
//     message: string;
//     data: { url: string };
//   }>("/upload/image", {
//     method: "POST",
//     body: formData, // fetcher now handles FormData correctly
//   });

//   if (!res.success) throw new Error(res.message || "Image upload failed");
//   return res.data.url;
// }



// app/actions/image-upload.ts
"use server";

import { protectedFetch } from "@/lib/protectedFetch";

export async function uploadImage(
  file: File
): Promise<string | { error: string }> {
  const formData = new FormData();
  formData.append("image", file);

  // Send formData to Cloudinary / backend image endpoint
  const res = await protectedFetch<{
    success: boolean;
    message: string;
    data: { url: string };
  }>("/upload/image", {
    method: "POST",
    body: formData, // fetcher now handles FormData correctly
  });

  // ✅ Return error instead of throwing
  if (!res.success) {
    return { error: res.error };
  }

  return res.data.data.url;
}