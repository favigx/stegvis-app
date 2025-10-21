import { useQuery } from "@tanstack/react-query";
import { getSkolverketSubjectsForProgram } from "../api/skolverket/skolverketAPI";
import type { SubjectResponse } from "../types/skolverket/subjectResponse"; 

export function useLoadSkolverketSubjectsForProgram(code: string | null) {
  return useQuery<SubjectResponse, Error>({
    queryKey: ["skolverketSubjects", code],
    queryFn: () => {
      if (!code) {
        return Promise.reject(new Error("Ingen programkod angiven"));
      }
      return getSkolverketSubjectsForProgram(code);
    },
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
}
