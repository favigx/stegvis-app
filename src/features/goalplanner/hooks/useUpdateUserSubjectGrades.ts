import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSubjectGrades } from "../api/gradesApi"; 
import type { AddUserSubjectGrades } from "../types/addUserSubjectGradesDTO";
import type { AddUserSubjectGradesResponse } from "../types/addUserSubjectGradesResponse";
import type { ApiError } from "../../../api/apiClient";

export function useUpdateUserSubjectGrades() {
  const queryClient = useQueryClient();

  return useMutation<
    AddUserSubjectGradesResponse,
    ApiError,
    AddUserSubjectGrades
  >({
    mutationFn: (dto: AddUserSubjectGrades) => updateUserSubjectGrades(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-grades"] });
    },
  });
}