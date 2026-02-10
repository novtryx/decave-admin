// "use server";

// import { protectedFetch } from "@/lib/protectedFetch";

// interface resType{
//     success: boolean;
//     message: string;
//     data: { url: string };
// }
// export async function uploadImage(file: File): Promise<resType> {
//   const formData = new FormData();
//   formData.append("image", file); 

//   const res = await protectedFetch<resType>("/upload/image", {
//     method: "POST",
//     body: formData,
//   });

//   if (!res.success) {
//     throw new Error(res.message || "Image upload failed");
//   }

//   return res;
// }



"use server";

import { protectedFetch } from "@/lib/protectedFetch";

interface ResType {
  success: boolean;
  message: string;
  data: { url: string };
}

export async function uploadImage(
  file: File
): Promise< any | { error: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await protectedFetch<ResType>("/upload/image", {
    method: "POST",
    body: formData,
  });

  // ✅ Return error instead of throwing
  if (!res.success) {
    return { error: res.error };
  }

  return res?.data?.data?.url;
}


// "use server";

// import { protectedFetch } from "@/lib/protectedFetch";

// interface UploadResponseData {
//   url: string;
//   publicId: string;
//   format: string;
//   width: number;
//   height: number;
// }

// export async function uploadImage(
//   file: File
// ): Promise<string | { error: string }> {
//   const formData = new FormData();
//   formData.append("image", file);

//   const res = await protectedFetch<UploadResponseData>("/upload/image", {
//     method: "POST",
//     body: formData,
//   });

//   // ✅ Return error if upload failed
//   if (!res.success) {
//     return { error: res.error };
//   }

//   // ✅ FIX: Correct path - only ONE .data, not .data.data
//   return res.data.url;
// }