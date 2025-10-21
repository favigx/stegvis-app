import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserGradedSubjects } from "../api/SubjectAPI";
import type { AddGradedSubjectsDTO } from "../types/addGradedSubjectsDTO";
import type { AddGradedSubjectsResponse } from "../types/addGradedSubjectsResponse";

export function useSetUserGradedSubjects() {
  const queryClient = useQueryClient();

  return useMutation<AddGradedSubjectsResponse, Error, AddGradedSubjectsDTO>({
    mutationFn: (gradedSubjects: AddGradedSubjectsDTO) =>
      setUserGradedSubjects(gradedSubjects),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
  });
}
