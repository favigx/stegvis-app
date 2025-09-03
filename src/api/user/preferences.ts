import type { UserPreference } from "../../interfaces/user/preferences";
import type { UserPreferenceResponse } from "../../interfaces/user/dto/preferenceResponse";
import { apiClient, type ApiError } from "../apiClient";

// Hjälpfunktion för Title Case
function toTitleCase(str: string | undefined | null): string | null {
  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function arrayToTitleCase(arr: (string | undefined)[] | null | undefined): string[] {
  if (!arr) return [];
  return arr.map(item => toTitleCase(item) as string);
}

// Default user preference om API returnerar null
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
      `/user/preferences`, // OBS: ingen userId i URL
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
      `/user/preferences` // OBS: ingen userId i URL
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
