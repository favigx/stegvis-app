import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "../api/notesAPI";
import type { AddNoteDTO } from "../types/addNoteDTO";
import type { AddNoteResponse } from "../types/addNoteResponse";

export function useAddNote() {
  const queryClient = useQueryClient();

  return useMutation<AddNoteResponse, Error, AddNoteDTO>({
    mutationFn: (note: AddNoteDTO) => addNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
