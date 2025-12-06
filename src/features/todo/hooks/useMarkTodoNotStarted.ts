import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markTodoNotStarted } from "../api/todoAPI";

export function useMarkTodoNotStarted() {
  const queryClient = useQueryClient();

  return useMutation({
  mutationFn: markTodoNotStarted,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
}