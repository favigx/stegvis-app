import type { AddTaskDTO } from "../types/addTaskDTO";
import type { AddTaskResponse } from "../types/addTaskResponse";
import type { TaskDTO } from "../types/taskDTO";
import type { TypeEnum } from "../types/taskTypeEnum"; 
import { apiClient } from "../../../api/apiClient"; 

const TASK_API_BASE = "/calender/task";

export async function addTask(addTaskDTO: AddTaskDTO): Promise<AddTaskResponse> {
  try {
    const response = await apiClient.post<AddTaskResponse>(`${TASK_API_BASE}`, addTaskDTO);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte lägga till task");
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function getTasks(): Promise<TaskDTO[]> {
  try {
    const response = await apiClient.get<TaskDTO[]>(`${TASK_API_BASE}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte hämta tasks");
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function getTaskTypeEnum(): Promise<TypeEnum> {
  try {
    const response = await apiClient.get<TypeEnum>('/calender/task/enum');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte hämta kalendertyper");
    }
    throw new Error("Kunde inte nå servern");
  }
}