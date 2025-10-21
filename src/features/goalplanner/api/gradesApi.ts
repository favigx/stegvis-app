import type { AddUserSubjectGrades } from "../types/addUserSubjectGradesDTO";
import type { AddUserSubjectGradesResponse } from "../types/addUserSubjectGradesResponse";
import { apiClient, type ApiError } from "../../../api/apiClient";
import type { Grade } from "../types/enumGrade";

export async function updateUserSubjectGrades(
  dto: AddUserSubjectGrades
): Promise<AddUserSubjectGradesResponse> {
  try {
    const response = await apiClient.put<AddUserSubjectGradesResponse>(
      "/subject-grades",
      dto
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        "Kunde inte uppdatera ämnesbetyg",
      status: error.response?.status,
    };
    throw apiError;
  }
}

export async function getAllEnums(): Promise<{ grades: Grade }> {
  try {
    const response = await apiClient.get<{ grades: Grade }>("/goalplanner/enums");
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        "Kunde inte hämta enums",
      status: error.response?.status,
    };
    throw apiError;
  }
}
