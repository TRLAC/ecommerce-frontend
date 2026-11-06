// profile.api.ts
import { apiClient } from "@/shared/api/apiClient";
import type { Profile, UpdateProfileRequest } from "../api/profile.type";

const PROFILE_API = {
  GET: "/profile",
  UPDATE: "/profile",
};

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const res = await apiClient.get(PROFILE_API.GET);
    return res.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const formData = new FormData();

    if (data.fullName) {
    formData.append("fullName", data.fullName);
    }

      if (data.phone) {
    formData.append("phone", data.phone);
    }

    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    const res = await apiClient.put(PROFILE_API.UPDATE, formData);

    return res.data;
  },
};