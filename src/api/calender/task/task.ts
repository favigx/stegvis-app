import type { AddTaskDTO } from "../../../interfaces/calender/task/dto/addTask";
import type { AddTaskResponse } from "../../../interfaces/calender/task/dto/addTaskResponse";
import type { TaskDTO } from "../../../interfaces/calender/task/dto/task";
import { store } from "../../../redux/store";
import { apiFetch } from "../../apiClient";

const TASK_API_BASE = "/calender/task";

export async function addTask(addTaskDTO: AddTaskDTO): Promise<AddTaskResponse> {
    const state = store.getState();
    const userId = state.auth.id;

    const data = await apiFetch(`${TASK_API_BASE}/${userId}`, {
        method: "POST",
        body: JSON.stringify(addTaskDTO),
    });

    return data as AddTaskResponse;
}

export async function getTasksByUserId(): Promise<TaskDTO[]> {
    const state = store.getState();
    const userId = state.auth.id;

    const data = await apiFetch(`${TASK_API_BASE}/${userId}`, { method: "GET" });
    return data as TaskDTO[];
}
