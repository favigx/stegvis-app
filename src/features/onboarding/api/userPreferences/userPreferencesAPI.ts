import type { UserPreference } from "../../types/userPreferences/userPreferences";
import type { UserPreferenceResponse } from "../../../auth/types/preferenceResponse";
import type { UserPreferenceEnums } from "../../types/userPreferences/userPreferenceEnums";
import type { AddUserPreferencesOnboardingDTO } from "../../types/userPreferences/addUserPreferencesOnboardingDTO";
import type { AddUserPreferencesOnboardingResponse } from "../../types/userPreferences/addUserPreferencesOnboardingResponse";

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
  fieldOfStudy: "",
  orientation: "",
  year: null,
  grades: [],
  subjects: [],
  focusDays: [],
  dailyGoal: null,
  helpRequests: [],
};

export async function setUserPreferences(addUserPreferencesOnboardingDTO: AddUserPreferencesOnboardingDTO): Promise<AddUserPreferencesOnboardingResponse> {
  const payload = {
    ...addUserPreferencesOnboardingDTO,
    educationLevel: addUserPreferencesOnboardingDTO.educationLevel?.toUpperCase() || null,
  };

  try {
    const response = await apiClient.put<AddUserPreferencesOnboardingResponse>(
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