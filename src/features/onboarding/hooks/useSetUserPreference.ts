import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserPreferences } from "../api/userPreferences/userPreferencesAPI";
import type { AddOnboardingPreferencesDTO } from "../types/userPreferences/addOnboardingPreferencesDTO"; 
import type { AddOnboardingPreferencesResponse } from "../types/userPreferences/addOnboardingPreferenceResponse"; 

export function useSetUserPreference() {
  const queryClient = useQueryClient();

  return useMutation<AddOnboardingPreferencesResponse, Error, AddOnboardingPreferencesDTO>({
    mutationFn: (payload) => setUserPreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
    onError: (error) => {
      console.error("Failed to set user preferences:", error);
    },
  });
}
