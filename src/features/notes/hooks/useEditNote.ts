import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditNoteDTO } from "../types/editNoteDTO";
import type { EditNoteResponse } from "../types/editNoteResponse";
import { editNoteById } from "../api/notesAPI";

export function useEditNote() {
  const queryClient = useQueryClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: EditNoteDTO }) =>
      editNoteById(data, noteId),
    onSuccess: (updatedNote: EditNoteResponse) => {
      queryClient.setQueryData(["note", updatedNote.id], updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const editNote = (noteId: string, data: EditNoteDTO, delay = 1500) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      mutation.mutate({ noteId, data });
    }, delay);
  };

  return {
    editNote,
    status: mutation.status,                       // 'idle' | 'pending' | 'success' | 'error'
    isLoading: mutation.status === "pending",      // React Query v5 använder 'pending'
    isError: mutation.status === "error",
    error: mutation.error ?? null,
  };
}
