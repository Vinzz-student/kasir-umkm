export type UserRole = "buyer" | "seller";

export type AuthUser = {
  id: number;
  name: string;
  nickname: string | null;
  username: string | null;
  email: string;
  role: UserRole;
};
