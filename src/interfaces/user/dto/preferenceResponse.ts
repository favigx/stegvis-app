import type { UserPreference } from "../preferences";

export interface UserPreferenceResponse {
    userId: string;
    userPreference: UserPreference;
}