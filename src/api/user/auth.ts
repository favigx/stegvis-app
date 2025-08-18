import type { LoginDTO } from "../../interfaces/user/dto/login";
import type { UserLoginResponse } from "../../interfaces/user/dto/loginResponse";
import { apiClient, type ApiError } from "../apiClient";

export async function loginUser(loginDto: LoginDTO): Promise<UserLoginResponse> {
  try {
    const response = await apiClient.post<UserLoginResponse>("/auth/login", loginDto);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Inloggning misslyckades",
      status: error.response?.status,
    };
    throw apiError;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Utloggning misslyckades",
      status: error.response?.status,
    };
    throw apiError;
  }
}
