import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getUserPreferences } from "../api/userPreferences/userPreferencesAPI";
import type { UserPreferenceResponse } from "../../auth/types/preferenceResponse";

export function useLoadUserPreferences() {
  const queryOptions: UseQueryOptions<UserPreferenceResponse, Error> = {
    queryKey: ["userPreferences"],
    queryFn: getUserPreferences,
    staleTime: 1000 * 60 * 5,
  };

  return useQuery(queryOptions);
}
