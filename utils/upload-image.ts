// // utils/uploadImage.ts
// import { protectedFetch } from "@/lib/protectedFetch";

// type UploadImageApiResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     url: string;
//   };
// };

// export async function uploadImage(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("image", file);

//   const res = await protectedFetch<UploadImageApiResponse>(
//     "/upload/image",
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!res.success) {
//     throw new Error(res.message || "Image upload failed");
//   }

//   return res.data.url;
// }


// utils/upload-image.ts (client-side)
import { protectedFetch } from "@/lib/protectedFetch";

export async function uploadImageClient(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await protectedFetch<{
    success: boolean;
    message: string;
    data: { url: string };
  }>("/upload/image", {
    method: "POST",
    body: formData,
  });

  if (!res.success) throw new Error(res.message || "Image upload failed");
  return res.data.url;
}
