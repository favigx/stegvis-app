import type { UserPreference } from "../../interfaces/user/preferences";
import type { UserPreferenceResponse } from "../../interfaces/user/dto/preferenceResponse";
import { apiFetch } from "../apiClient";
import { store } from "../../redux/store";

export async function setUserPreferences(userPreference: UserPreference): Promise<UserPreferenceResponse> {
    const state = store.getState();
    const userId = state.auth.id;
    
const payload = {
      ...userPreference,
        educationLevel: userPreference.educationLevel?.toString().toUpperCase() || null,
        fieldOfStudy: userPreference.fieldOfStudy?.toString().toUpperCase() || null,
        subjects: userPreference.subjects?.map(s => s.toUpperCase()) || [],
        focusDays: userPreference.focusDays?.map(d => d.toUpperCase()) || [],
        dailyGoal: userPreference.dailyGoal,
        helpRequests: userPreference.helpRequests?.map(h => h.toUpperCase()) || [],
    };

    return apiFetch(`/user/${userId}/preferences`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }) as Promise<UserPreferenceResponse>;
}