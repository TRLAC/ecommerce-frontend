import { apiClient } from "@/shared/api/apiClient";
import type { Profile, UpdateProfileRequest } from "../profile.type";

const PROFILE_API = {
  GET: "/profile",
  UPDATE: "/profile",
};

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const res = await apiClient.get(PROFILE_API.GET);
    return res.data;
  },

  // BE: PUT multipart/form-data (UpdateProfileRequest). Field không gửi = giữ nguyên.
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const formData = new FormData();

    if (data.fullName !== undefined) formData.append("fullName", data.fullName);
    if (data.email !== undefined) formData.append("email", data.email);
    if (data.phone !== undefined) formData.append("phone", data.phone);
    if (data.address !== undefined) formData.append("address", data.address);
    if (data.avatar instanceof File) formData.append("avatar", data.avatar);

    const res = await apiClient.put(PROFILE_API.UPDATE, formData);
    return res.data;
  },
};
