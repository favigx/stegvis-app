import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserGradeGoal } from "../api/SubjectAPI";
import type { AddGradeGoalDTO } from "../types/addGradeGoalDTO";
import type { AddGradeGoalResponse } from "../types/addGradeGoalResponse";

export function useSetUserGradeGoal() {
  const queryClient = useQueryClient();

  return useMutation<
    AddGradeGoalResponse,
    Error,
    AddGradeGoalDTO[]
  >({
    mutationFn: (subjectGrades: AddGradeGoalDTO[]) =>
      setUserGradeGoal(subjectGrades),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
  });
}