import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { deleteTodoFile } from "../api/todoAPI";

export function useDeleteTodoFile(todoId: string): UseMutationResult<void, Error, string> {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: (todoFileId: string) => deleteTodoFile(todoFileId),
        onSuccess: () => {
            // Invalidate files för denna todo så listan uppdateras
            queryClient.invalidateQueries({ queryKey: ["todoFiles", todoId] });
        },
    });
}
