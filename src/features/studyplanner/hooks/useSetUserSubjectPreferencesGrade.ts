import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserSubjectPreferencesGrade } from "../api/SubjectAPI";
import type { AddGradeForCurrentResponse } from "../types/addGradeForCurrentResponse";
import type { AddGradeForCurrentDTO } from "../types/addGradeForCurrentDTO";

export function useSetUserSubjectPreferencesGrade() {
  const queryClient = useQueryClient();

  return useMutation<
    AddGradeForCurrentResponse,
    Error,
    AddGradeForCurrentDTO[]
  >({
    mutationFn: (subjectGrades: AddGradeForCurrentDTO[]) =>
      setUserSubjectPreferencesGrade(subjectGrades),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
  });
}