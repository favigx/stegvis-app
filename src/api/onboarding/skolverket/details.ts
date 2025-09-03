import { apiClient } from "../../apiClient";
import type { ProgramResponse } from "./dto/programResponse";
import type { SubjectResponse } from "./dto/subjectResponse";

export async function getSkolverketPrograms(): Promise<ProgramResponse> {
  try {
    const response = await apiClient.get<ProgramResponse>("/skolverket/programs");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      throw new Error(apiError.response?.data?.message || "Kunde inte hämta program");
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