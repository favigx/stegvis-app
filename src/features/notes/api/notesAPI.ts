import type { AddNoteDTO } from "../types/addNoteDTO";
import type { AddNoteResponse } from "../types/addNoteResponse";
// import type { NoteDTO } from "./dto/NoteDTO";
import { apiClient } from "../../../api/apiClient"; 

const TASK_API_BASE = "/note";

export async function addNote(addNoteDTO: AddNoteDTO): Promise<AddNoteResponse> {
  try {
    const response = await apiClient.post<AddNoteResponse>(`${TASK_API_BASE}`, addNoteDTO);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte lägga till note");
    }
    throw new Error("Kunde inte nå servern");
  }
}

// export async function getTasks(): Promise<TaskDTO[]> {
//   try {
//     const response = await apiClient.get<TaskDTO[]>(`${TASK_API_BASE}`);
//     return response.data;
//   } catch (error: any) {
//     if (error.response) {
//       throw new Error(error.response.data?.message || "Kunde inte hämta tasks");
//     }
//     throw new Error("Kunde inte nå servern");
//   }
// }
