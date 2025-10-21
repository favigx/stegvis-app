import { AxiosError } from "axios";
import { apiClient } from "../../../../api/apiClient";
import type { ProgramResponse } from "../../types/skolverket/programResponse";
import type { SubjectResponse } from "../../types/skolverket/subjectResponse";

export async function getSkolverketPrograms(): Promise<ProgramResponse[]> {
  try {
    const response = await apiClient.get<{ programs: ProgramResponse[] }>("/skolverket/programs");
    return response.data.programs; 
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


export async function getSkolverketSubjectsForProgram(code: string): Promise<SubjectResponse> {
  try {
    const response = await apiClient.get<SubjectResponse>(`/skolverket/programs/${code}/subjects`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte hämta ämnen för program");
    }
    throw new Error("Kunde inte nå servern");
  }
}