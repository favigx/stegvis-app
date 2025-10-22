import type { AddNoteCollectionDTO } from "../types/noteCollections/addNoteCollectionDTO";
import type { AddNoteCollectionResponse } from "../types/noteCollections/addNoteCollectionResponse";
import type { AddNoteToCollectionDTO } from "../types/noteCollections/addNoteToCollectionDTO"; 
import type { AddNoteToCollectionResponse } from "../types/noteCollections/addNoteToCollectionResponse";
import type { NoteCollectionDTO } from "../types/noteCollections/noteCollectionDTO"; 
import { apiClient } from "../../../api/apiClient";


const NOTE_COLLECTION_API_BASE = "/notes/notecollection";

export async function createNoteCollection(
  dto: AddNoteCollectionDTO
): Promise<AddNoteCollectionResponse> {
  try {
    const response = await apiClient.post<AddNoteCollectionResponse>(
      `${NOTE_COLLECTION_API_BASE}`,
      dto
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Kunde inte skapa note collection"
      );
    }
    throw new Error("Kunde inte nå servern");
  }
}


export async function addNoteToCollection(
  dto: AddNoteToCollectionDTO
): Promise<AddNoteToCollectionResponse> {
  try {
    const response = await apiClient.post<AddNoteToCollectionResponse>(
      `${NOTE_COLLECTION_API_BASE}/add-note`,
      dto
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Kunde inte lägga till note i collection"
      );
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function getNoteCollection(
  collectionId: string
): Promise<NoteCollectionDTO> {
  try {
    const response = await apiClient.get<NoteCollectionDTO>(
      `${NOTE_COLLECTION_API_BASE}/${collectionId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Kunde inte hämta note collection"
      );
    }
    throw new Error("Kunde inte nå servern");
  }
}

export async function getAllNoteCollections(): Promise<NoteCollectionDTO[]> {
  try {
    const response = await apiClient.get<NoteCollectionDTO[]>(
      `${NOTE_COLLECTION_API_BASE}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Kunde inte hämta alla note collections"
      );
    }
    throw new Error("Kunde inte nå servern");
  }
}