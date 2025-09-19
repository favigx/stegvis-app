import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNoteById } from "../api/notesAPI";
import type { DeleteNoteResponse } from "../types/deleteNoteResponse";

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation<DeleteNoteResponse, Error, string>({
    mutationFn: (noteId: string) => deleteNoteById(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
