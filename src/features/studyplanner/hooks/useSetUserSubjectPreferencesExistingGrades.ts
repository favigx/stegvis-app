import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserSubjectPreferencesGradeExisting } from "../api/SubjectAPI";
import type { AddSubjectPreferencesGradeDTO } from "../types/addSubjectPreferenceGradeDTO";
import type { AddSubjectPreferencesGradeResponse } from "../types/addSubjectPreferenceGradeResponse"; 

export function useSetUserSubjectPreferencesExistingGrade() {
  const queryClient = useQueryClient();

  return useMutation<
    AddSubjectPreferencesGradeResponse,
    Error,
    AddSubjectPreferencesGradeDTO[]
  >({
    mutationFn: (subjectGrades: AddSubjectPreferencesGradeDTO[]) =>
      setUserSubjectPreferencesGradeExisting(subjectGrades),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
  });
}