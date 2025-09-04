import type { UserPreference } from "../../onboarding/types/userPreferences/userPreferences";

export interface UserPreferenceResponse {
    userId: string;
    userPreference: UserPreference;
}