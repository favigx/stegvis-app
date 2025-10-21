import type { UserProfileResponse } from "../types/UserProfileResponse"; 
import { apiClient, type ApiError } from "../../api/apiClient";

export async function getCurrentUser(): Promise<UserProfileResponse> {
  try {
    const response = await apiClient.get<UserProfileResponse>("/user/me");
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Kunde inte hämta användarprofil",
      status: error.response?.status,
    };
    throw apiError;
  }
}
