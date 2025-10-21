import { useQuery } from "@tanstack/react-query";
import { getEligiblePrograms } from "../api/UhrAPI"; 
import type { EligibleProgramResponse } from "../types/EligibleProgramResponse";

export function useLoadEligiblePrograms(searchFor: string | null) {
  return useQuery<EligibleProgramResponse[], Error>({
    queryKey: ["eligiblePrograms", searchFor],
    queryFn: () => {
      if (!searchFor) {
        return Promise.reject(new Error("Ingen sökterm angiven"));
      }
      return getEligiblePrograms(searchFor);
    },
    enabled: !!searchFor,
    staleTime: 1000 * 60 * 5,
  });
}
