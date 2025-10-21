import type { AddSubjectPreferencesDTO } from "../types/addSubjectPreferencesDTO";
import type { AddSubjectPreferencesResponse } from "../types/addSubjectPreferencesResponse";
import type { AddSubjectPreferencesGradeDTO } from "../types/addSubjectPreferenceGradeDTO";
import type { AddSubjectPreferencesGradeResponse } from "../types/addSubjectPreferenceGradeResponse";
import type { AddGradeGoalDTO } from "../types/addGradeGoalDTO";
import type { AddGradeGoalResponse } from "../types/addGradeGoalResponse";
import type { AddGradedSubjectsDTO } from "../types/addGradedSubjectsDTO";
import type { AddGradedSubjectsResponse } from "../types/addGradedSubjectsResponse";
import { apiClient, type ApiError } from "../../../api/apiClient";
import type { AddGradeForCurrentDTO } from "../types/addGradeForCurrentDTO";
import type { AddGradeForCurrentResponse } from "../types/addGradeForCurrentResponse";

const PREFERENCE_API_BASE = "/user"


export async function setUserSubjectPreferences(addSubjectPreferencesDTO: AddSubjectPreferencesDTO): Promise<AddSubjectPreferencesResponse> {
    try {
        const response = await apiClient.put<AddSubjectPreferencesResponse>(`${PREFERENCE_API_BASE}/preferences/subjects`, addSubjectPreferencesDTO);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte lägga till ämnen");
        }
        throw new Error("Kunde inte nå servern")
    }
}

export async function setUserGradedSubjects(addGradedSubjectsDTO: AddGradedSubjectsDTO): Promise<AddGradedSubjectsResponse> {
    try {
        const response = await apiClient.put<AddSubjectPreferencesResponse>(`${PREFERENCE_API_BASE}/preferences/gradedsubjects`, addGradedSubjectsDTO);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte lägga till klara ämnen");
        }
        throw new Error("Kunde inte nå servern")
    }
}

export async function setUserSubjectPreferencesGrade(
  currentDto: AddGradeForCurrentDTO[]
): Promise<AddGradeForCurrentResponse> {
  try {
    const response = await apiClient.put<AddGradeForCurrentResponse>(
      `${PREFERENCE_API_BASE}/preferences/subject-grades`,
      currentDto
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte sätta betyg på ämnen");
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function setUserSubjectPreferencesGradeExisting(
  currentDto: AddSubjectPreferencesGradeDTO[]
): Promise<AddSubjectPreferencesGradeResponse> {
  try {
    const response = await apiClient.put<AddSubjectPreferencesGradeResponse>(
      `${PREFERENCE_API_BASE}/preferences/subject-grades/existing`,
      currentDto
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte sätta betyg på ämnen");
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function setUserGradeGoal(
  gradeGoal: AddGradeGoalDTO[]
): Promise<AddGradeGoalResponse> {
  try {
    const response = await apiClient.put<AddGradeGoalResponse>(
      `${PREFERENCE_API_BASE}/preferences/subject-grades/grade-goal`,
      gradeGoal
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte sätta betygsmål på ämnen");
    }
    throw new Error("Kunde inte nå servern");
  }
}