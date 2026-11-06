import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import type { UpdateProfileRequest } from "../api/profile.type";
import { useAuthStore } from "@/features/auth/store";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      profileApi.updateProfile(data),

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);

        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setUser({
            ...currentUser,
            avatar: updatedProfile.avatar,
            fullName: updatedProfile.fullName,
            phone: updatedProfile.phone,
          });
        }
      },
  });
};