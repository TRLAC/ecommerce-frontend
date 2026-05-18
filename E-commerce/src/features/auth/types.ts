export type Role = "ROLE_USER" | "ROLE_ADMIN";

export type User = {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatar: string | null;
  roles: Role[];
};


export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    fullName: string;
    email: string;
    password: string;
};

export type AuthResponse = {
   accessToken: string;
    user: User;
};

