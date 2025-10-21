import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserSubjectPreferences } from "../api/SubjectAPI"; 
import type { AddSubjectPreferencesDTO } from "../types/addSubjectPreferencesDTO";
import type { AddSubjectPreferencesResponse } from "../types/addSubjectPreferencesResponse";

export function useSetUserSubjectPreferences() {
  const queryClient = useQueryClient();

  return useMutation<AddSubjectPreferencesResponse, Error, AddSubjectPreferencesDTO>({
    mutationFn: (subjectPreference: AddSubjectPreferencesDTO) =>
      setUserSubjectPreferences(subjectPreference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
  });
}
