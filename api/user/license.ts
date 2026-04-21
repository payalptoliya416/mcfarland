import { api } from "../http";

export interface UploadLicenseResponse {
  status: boolean;
  message?: string;
  applicantId?: string;
}
export const uploadLicense = async (
  formData: FormData
): Promise<UploadLicenseResponse> => {
  return api("/user/license/upload", {
    method: "POST",
    body: formData,
  });
};
export const getLicenseStatus = async (): Promise<any> => {
  return api("/user/license/status", {
    method: "POST",
  });
};
export interface UploadLicenseResponse {
  status: boolean;
  message?: string;
  data?: any;
}

export const uploadLicenseData = async (
  formData: FormData
): Promise<UploadLicenseResponse> => {
  return api("/user/upload-license", {
    method: "POST",
    body: formData,
  });
};
