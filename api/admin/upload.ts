import { adminApi } from "@/api/admin/http";

export interface UploadImageResponse {
  status: boolean;
  data: {
    images: {
      filename: string;
      url: string;
    }[];
  };
}
export interface UploadVideoResponse {
  status: boolean;
  data: {
    videos: Array<{ url: string }>
  };
}

export const adminUploadService = {
  uploadImage: (formData: FormData) =>
    adminApi<UploadImageResponse>("/upload/image", {
      method: "POST",
      body: formData,
    }),

  uploadVideo: (formData: FormData) =>

    adminApi<UploadVideoResponse>("/upload/video", {
      method: "POST",
      body: formData,
    }),
};
