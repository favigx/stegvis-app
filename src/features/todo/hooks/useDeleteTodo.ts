import { useMutation } from "@tanstack/react-query";
import { deleteTodoById } from "../api/todoAPI";
import type { DeleteTodoResponse } from "../types/DeleteTodoResponse";

export function useDeleteTodo() {
  return useMutation<DeleteTodoResponse, Error, string>({
    mutationFn: deleteTodoById,
  });
}
