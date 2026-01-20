// utils/uploadImage.ts

type UploadImageApiResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
  };
};
