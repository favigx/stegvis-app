import { useQuery } from "@tanstack/react-query";
import { getFilesForTodo } from "../api/todoAPI";
import type { TodoFileResponse } from "../types/todoFileResponse";

export function useGetFilesForTodo(todoId: string) {
  return useQuery<TodoFileResponse[]>({
    queryKey: ["todoFiles", todoId],
    queryFn: () => getFilesForTodo(todoId),
    staleTime: 1000 * 60, // 1 minut, kan justeras
  });
}
