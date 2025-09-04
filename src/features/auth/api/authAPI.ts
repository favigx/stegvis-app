import type { LoginDTO } from "../types/login";
import type { UserLoginResponse } from "../types/loginResponse";
import type { RegisterDTO } from "../types/register";
import type { UserRegisterResponse } from "../types/registerResponse";
import { apiClient, type ApiError } from "../../../api/apiClient";

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

export async function registerUser(registerDto: RegisterDTO): Promise<UserRegisterResponse> {
  try {
    const response = await apiClient.post<UserRegisterResponse>("/auth/register", registerDto);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Något gick fel vid registrering");
    }
    throw new Error("Kunde inte nå servern");
  }
}
