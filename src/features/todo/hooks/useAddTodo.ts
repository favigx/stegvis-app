import { useMutation } from "@tanstack/react-query";
import { addTodo } from "../api/todoAPI"; 
import type { AddTodoDTO } from "../types/addTodoDTO";
import type { AddTodoResponse } from "../types/addTodoResponse";

export function useAddTodo() {
  return useMutation<AddTodoResponse, Error, AddTodoDTO>({
    mutationFn: addTodo,
  });
}
