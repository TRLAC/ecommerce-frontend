import type { Role } from "@/features/auth/types";

export interface Profile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatar: string | null;
  address: string | null;
  roles: Role[];
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: File | null;
}
