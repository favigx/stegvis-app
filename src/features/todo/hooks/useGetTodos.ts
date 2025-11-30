import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../api/todoAPI"; 
import type { TodoResponse } from "../types/TodoResponse";

export function useGetTodos() {
  return useQuery<TodoResponse[], Error>({
    queryKey: ["todos"],
    queryFn: getTodos,
    staleTime: 1000 * 60 * 5,
  });
}
