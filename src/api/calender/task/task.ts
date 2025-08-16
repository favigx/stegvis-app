import type { AddTaskDTO } from "../../../interfaces/calender/task/dto/addTask";
import type { AddTaskResponse } from "../../../interfaces/calender/task/dto/addTaskResponse";
import type { TaskDTO } from "../../../interfaces/calender/task/dto/task";
import { store } from "../../../redux/store";
import { apiFetch } from "../../apiClient";

const TASK_API_BASE = "/calender/task";



export async function addTask(addTaskDTO: AddTaskDTO): Promise<AddTaskResponse> {

    const state = store.getState();
    const userId = state.auth.id;

    return apiFetch(`${TASK_API_BASE}/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(addTaskDTO),
    }) as Promise<AddTaskResponse>;
}

export async function getTasksByUserId(): Promise<TaskDTO[]> {
    const state = store.getState();
    const userId = state.auth.id;

    return apiFetch(`${TASK_API_BASE}/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }) as Promise<TaskDTO[]>
}