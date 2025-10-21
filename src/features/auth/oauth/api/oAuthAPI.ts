import { apiClient, type ApiError } from '../../../../api/apiClient';

export async function getGoogleAuthUrl(): Promise<string> {
  try {
    const response = await apiClient.get<{ authorizationUrl: string }>("/oauth2/google/url");
    return response.data.authorizationUrl;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Kunde inte hämta Google URL",
      status: error.response?.status,
    };
    throw apiError;
  }
}