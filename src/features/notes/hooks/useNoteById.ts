import { useQuery } from "@tanstack/react-query";
import type { NoteDTO } from "../types/noteDTO";
import { getNoteById } from "../api/notesAPI";

export function useNoteById(noteId?: string) {
  return useQuery<NoteDTO, Error>({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId!),
    enabled: !!noteId,
  });
}
