import type { AddTodoDTO } from "../types/addTodoDTO";
import type { AddTodoResponse } from "../types/addTodoResponse";
import type { TodoResponse } from "../types/TodoResponse";
import type { DeleteTodoResponse } from "../types/DeleteTodoResponse";

import { apiClient } from "../../../api/apiClient";

const TODO_API_BASE = "/todo"

export async function addTodo(addTodoDTO: AddTodoDTO): Promise<AddTodoResponse> {
    try {
        const response = await apiClient.post<AddTodoResponse>(`${TODO_API_BASE}`, addTodoDTO);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte lägga till todo");
        }
        throw new Error("Kunde inte nå servern");
    }
}

export async function getTodos(): Promise<TodoResponse[]> {
    try {
        const response = await apiClient.get<TodoResponse[]>(`${TODO_API_BASE}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte hämta todos");
        }
        throw new Error("Kunde inte nå servern");
    }
}

export async function deleteTodoById(todoId: string): Promise<DeleteTodoResponse> {
    try {
        const response = await apiClient.delete<DeleteTodoResponse>(`${TODO_API_BASE}/${todoId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte radera todo");
        }
    } throw new Error("Kunde inte nå servern");
}