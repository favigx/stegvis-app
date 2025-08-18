import type { TypeEnum } from "../../../interfaces/calender/task/enum/type"; 
import { apiClient } from "../../apiClient";

export async function getCalenderTypeEnum(): Promise<TypeEnum> {
  try {
    const response = await apiClient.get<TypeEnum>('/calender/task/enum');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte hämta kalendertyper");
    }
    throw new Error("Kunde inte nå servern");
  }
}