import type { AddNoteDTO } from "../types/addNoteDTO";
import type { AddNoteResponse } from "../types/addNoteResponse";
import type { NoteDTO } from "../types/noteDTO"; 
import type { DeleteNoteResponse } from "../types/deleteNoteResponse";
import type { EditNoteDTO } from "../types/editNoteDTO";
import type { EditNoteResponse } from "../types/editNoteResponse";
import { apiClient } from "../../../api/apiClient"; 

const NOTE_API_BASE = "/notes";

export async function addNote(addNoteDTO: AddNoteDTO): Promise<AddNoteResponse> {
  try {
    const response = await apiClient.post<AddNoteResponse>(`${NOTE_API_BASE}`, addNoteDTO);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte lägga till note");
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function getNotes(
  params?: {
    subject?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    ascending?: boolean;
  }
): Promise<NoteDTO[]> {
  try {
    const response = await apiClient.get<NoteDTO[]>(`${NOTE_API_BASE}/filter`, {
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte hämta notes");
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function getNoteById(noteId: string): Promise<NoteDTO> {
  try {
    const response = await apiClient.get<NoteDTO>(`${NOTE_API_BASE}/${noteId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte hämta note");
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function deleteNoteById(noteId: string): Promise<DeleteNoteResponse> {
  try {
    const response = await apiClient.delete<DeleteNoteResponse>(`${NOTE_API_BASE}/${noteId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte radera note");
    }
  } throw new Error("Kunde inte nå servern");
}

export async function editNoteById(editNoteDTO: EditNoteDTO, noteId: string): Promise<EditNoteResponse> {
  try {
    const response = await apiClient.put<EditNoteResponse>(`${NOTE_API_BASE}/${noteId}`, editNoteDTO);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte redigera note");
    }
  } throw new Error("Kunde inte nå servern");
}

export async function getNotesCount(): Promise<number> {
  try {
    const response = await apiClient.get<number>(`${NOTE_API_BASE}/count`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Kunde inte hämta antal anteckningar");
    }
    throw new Error("Kunde inte nå servern");
  }
}
