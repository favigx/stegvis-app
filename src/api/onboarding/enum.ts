import type { UserPreferenceEnums } from "../../interfaces/user/enum/userPreferenceEnums";
import { apiFetch } from "../apiClient";

export async function getUserPreferenceEnums(): Promise<UserPreferenceEnums> {
    return apiFetch('/onboarding/enums', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }) as Promise<UserPreferenceEnums>
}