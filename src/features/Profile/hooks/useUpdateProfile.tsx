import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import type { UpdateProfileRequest } from "../profile.type";
import { useAuthStore } from "@/features/auth/store";
import { authApi } from "@/features/auth/api/auth.api";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/utils/apiError";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),

    onSuccess: async (updated) => {
      queryClient.setQueryData(["profile"], updated);

      const store = useAuthStore.getState();
      const current = store.user;

      // JWT chứa email cũ → đổi email xong access token cũ không dùng được nữa.
      // Xin token mới bằng refresh cookie (refresh token gắn với user, không phụ thuộc email).
      if (current && current.email !== updated.email) {
        try {
          const auth = await authApi.refresh();
          store.setAccessToken(auth.accessToken);
          store.setUser(auth.user);
        } catch {
          toast.info("Email đã đổi, vui lòng đăng nhập lại");
          store.logout();
          return;
        }
      } else if (current) {
        store.setUser({
          ...current,
          avatar: updated.avatar,
          fullName: updated.fullName,
          phone: updated.phone,
          address: updated.address ?? "",
        });
      }
      toast.success("Đã cập nhật hồ sơ");
    },

    onError: (err) => toast.error(getErrorMessage(err, "Không cập nhật được hồ sơ")),
  });
};