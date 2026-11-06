import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
  });
};