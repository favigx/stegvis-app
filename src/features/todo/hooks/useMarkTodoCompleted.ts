import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markTodoCompleted } from "../api/todoAPI";

export function useMarkTodoCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
  mutationFn: markTodoCompleted,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
}