import type { UserPreferenceEnums } from "../../interfaces/user/enum/userPreferenceEnums";
import { apiClient } from "../apiClient";

export async function getUserPreferenceEnums(): Promise<UserPreferenceEnums> {
  try {
    const response = await apiClient.get<UserPreferenceEnums>("/onboarding/enums");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte hämta enums");
    }
    throw new Error("Kunde inte nå servern");
  }
}