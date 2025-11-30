import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markTodoOngoing } from "../api/todoAPI";
export function useMarkTodoOngoing() {
  const queryClient = useQueryClient();

return useMutation({
  mutationFn: markTodoOngoing,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
}