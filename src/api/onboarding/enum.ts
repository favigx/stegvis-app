import type { UserPreferenceEnums } from "../../interfaces/user/enum/userPreferenceEnums";
import { apiFetch } from "../apiClient";

export async function getUserPreferenceEnums(): Promise<UserPreferenceEnums> {
    const data = await apiFetch('/onboarding/enums', {
        method: 'GET',
    });

    return data as UserPreferenceEnums;
}