import type { UserPreference } from "../../types/userPreferences/userPreferences";
import type { UserPreferenceResponse } from "../../../auth/types/preferenceResponse";
import type { UserPreferenceEnums } from "../../types/userPreferences/userPreferenceEnums";

import { apiClient, type ApiError } from "../../../../api/apiClient";

function toTitleCase(str: string | undefined | null): string | null {
  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function arrayToTitleCase(arr: (string | undefined)[] | null | undefined): string[] {
  if (!arr) return [];
  return arr.map(item => toTitleCase(item) as string);
}

const defaultUserPreference: UserPreference = {
  educationLevel: "",
  year: null,
  fieldOfStudy: "",
  subjects: [],
  focusDays: [],
  dailyGoal: null,
  helpRequests: [],
};

export async function setUserPreferences(
  userPreference: UserPreference
): Promise<UserPreferenceResponse> {
  const payload = {
    ...userPreference,
    educationLevel: userPreference.educationLevel?.toUpperCase() || null,
    focusDays: userPreference.focusDays?.map(d => d.toUpperCase()) || [],
    dailyGoal: userPreference.dailyGoal,
    helpRequests: userPreference.helpRequests?.map(h => h.toUpperCase()) || [],
  };

  try {
    const response = await apiClient.put<UserPreferenceResponse>(
      `/user/preferences`,
      payload
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = error;
    throw apiError;
  }
}

export async function getUserPreferences(): Promise<UserPreferenceResponse> {
  try {
    const response = await apiClient.get<UserPreferenceResponse>(
      `/user/preferences`
    );

    const data = response.data;
    const safeUserPreference = data.userPreference ?? defaultUserPreference;

    const normalizedPrefs: UserPreference = {
      ...safeUserPreference,
      educationLevel: toTitleCase(safeUserPreference.educationLevel),
      focusDays: arrayToTitleCase(safeUserPreference.focusDays),
      helpRequests: arrayToTitleCase(safeUserPreference.helpRequests),
    };

    return {
      ...data,
      userPreference: normalizedPrefs,
    };
  } catch (error: any) {
    const apiError: ApiError = error;
    throw apiError;
  }
}

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