import { useQuery } from "@tanstack/react-query";
import { getAllEnums } from "../api/gradesApi";
import type { Grade } from "../types/enumGrade"; 
import type { ApiError } from "../../../api/apiClient";

export function useGetAllEnums() {
  return useQuery<{ grades: Grade }, ApiError>({
    queryKey: ["grades-enums"],
    queryFn: () => getAllEnums(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
