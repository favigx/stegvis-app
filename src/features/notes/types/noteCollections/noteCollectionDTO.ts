import type { NoteDTO } from "../noteDTO"; 

export interface NoteCollectionDTO {
  id: string;
  name: string;
  notes: NoteDTO[];
}