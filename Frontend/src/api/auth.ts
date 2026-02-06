import api from "./client";

type LoginResponse = {
  token: string;
  user: {
    email: string;
    role: string;
  };
};

export const loginAdmin = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/api/auth/login", { email, password });
  return response.data;
};
