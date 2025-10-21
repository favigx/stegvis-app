import { useQuery } from "@tanstack/react-query";
import { getUserPreferenceEnums } from "../api/userPreferences/userPreferencesAPI"; 
import type { UserPreferenceEnums } from "../types/userPreferences/userPreferenceEnums";

export function useLoadEnums() {
  return useQuery<UserPreferenceEnums, Error>({
    queryKey: ["userPreferenceEnums"],
    queryFn: getUserPreferenceEnums,
    staleTime: 1000 * 60 * 5,
  });
}
