import type { AddTodoDTO } from "../types/addTodoDTO";
import type { AddTodoResponse } from "../types/addTodoResponse";
import type { TodoResponse } from "../types/TodoResponse";
import type { DeleteTodoResponse } from "../types/DeleteTodoResponse";

import { apiClient } from "../../../api/apiClient";
import type { UploadFileResponse } from "../types/uploadFileResponse";
import type { TodoFileResponse } from "../types/todoFileResponse";

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

export async function markTodoOngoing(todoId: string): Promise<void> {
    try {
        await apiClient.put(`${TODO_API_BASE}/${todoId}/ongoing`);
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte markera todo som ongoing");
        }
        throw new Error("Kunde inte nå servern");
    }
}

export async function markTodoCompleted(todoId: string): Promise<void> {
    try {
        await apiClient.put(`${TODO_API_BASE}/${todoId}/completed`);
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte markera todo som completed");
        }
        throw new Error("Kunde inte nå servern");
    }
}

export async function markTodoNotStarted(todoId: string): Promise<void> {
    try {
        await apiClient.put(`${TODO_API_BASE}/${todoId}/notstarted`);
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte markera todo som completed");
        }
        throw new Error("Kunde inte nå servern");
    }
}

export async function uploadFile(todoId: string, file: File): Promise<UploadFileResponse> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post<UploadFileResponse>(
            `${TODO_API_BASE}/${todoId}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte ladda upp filen");
        }
        throw new Error("Kunde inte nå servern");
    }
}

export async function getFilesForTodo(todoId: string): Promise<TodoFileResponse[]> {
    try {
        const response = await apiClient.get<TodoFileResponse[]>(`${TODO_API_BASE}/${todoId}/files`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte hämta filer för todo");
        }
        throw new Error("Kunde inte nå servern");
    }
}

export async function getFileUrl(todoFileId: string): Promise<string> {
    try {
        const response = await apiClient.get<string>(`${TODO_API_BASE}/${todoFileId}/download`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte hämta filens URL");
        }
        throw new Error("Kunde inte nå servern");
    }
}

export async function deleteTodoFile(todoFileId: string): Promise<void> {
    try {
        await apiClient.delete(`${TODO_API_BASE}/file/${todoFileId}`);
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte radera filen");
        }
        throw new Error("Kunde inte nå servern");
    }
}
