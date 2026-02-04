// utils/upload-image.ts (client-side)
// import { protectedFetch } from "@/lib/protectedFetch";

// export async function uploadImageClient(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("image", file);

//   const res = await protectedFetch<{
//     success: boolean;
//     message: string;
//     data: { url: string };
//   }>("/upload/image", {
//     method: "POST",
//     body: formData,
//   });

//   if (!res.success) throw new Error(res.message || "Image upload failed");
//   return res.data.url;
// }
// import { protectedFetch } from "@/lib/protectedFetch";

// export async function uploadImageClient(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("image", file);

//   // T is the success shape
//   const res = await protectedFetch<{
//     success: boolean;
//     message: string;
//     data: { url: string };
//   }>("/upload/image", {
//     method: "POST",
//     body: formData,
//   });

//   // Narrow union: check if 'error' exists
//   if ("error" in res) {
//     // This is the not-authenticated or failed branch
//     throw new Error(res.error);
//   }

//   // ✅ Here TS knows 'res' is the success shape
//   if (!res.success) {
//     throw new Error(res.message || "Image upload failed");
//   }

//   return res.data.url;
// }

import { protectedFetch } from "@/lib/protectedFetch";

type UploadResponse = {
  url: string;
};

export async function uploadImageClient(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await protectedFetch<UploadResponse>("/upload/image", {
    method: "POST",
    body: formData,
  });

  // Check for auth error
  if (!res.success) {
    throw new Error(res.error);
  }

  // Success case - access via res.data
  return res.data.url;
}