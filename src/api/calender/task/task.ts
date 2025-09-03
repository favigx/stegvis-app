import type { AddTaskDTO } from "../../../interfaces/calender/task/dto/addTask";
import type { AddTaskResponse } from "../../../interfaces/calender/task/dto/addTaskResponse";
import type { TaskDTO } from "../../../interfaces/calender/task/dto/task";
import { apiClient } from "../../apiClient"; 

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
