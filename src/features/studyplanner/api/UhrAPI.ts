import type { EligibleProgramResponse } from "../types/EligibleProgramResponse";
import { apiClient } from "../../../api/apiClient";
import { AxiosError } from "axios";

export async function getEligiblePrograms(searchFor: string): Promise<EligibleProgramResponse[]> {
  try {
    const response = await apiClient.get<EligibleProgramResponse[]>(
      `/uhr/eligible-programs?searchfor=${encodeURIComponent(searchFor)}`
    );
    return response.data; // direkt array från backend
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Kunde inte hämta program";
      throw new Error(message);
    }

    throw new Error("Kunde inte nå servern");
  }
}
