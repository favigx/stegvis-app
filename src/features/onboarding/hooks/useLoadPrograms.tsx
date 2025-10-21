import { useQuery } from "@tanstack/react-query";
import { getSkolverketPrograms } from "../api/skolverket/skolverketAPI";
import type { ProgramResponse } from "../types/skolverket/programResponse";

export function useLoadPrograms() {
  return useQuery<ProgramResponse[], Error>({
    queryKey: ["programs"],
    queryFn: getSkolverketPrograms,
    staleTime: 1000 * 60 * 5,
  });
}
