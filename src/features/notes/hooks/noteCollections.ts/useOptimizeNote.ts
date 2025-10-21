import { useMutation, useQueryClient } from "@tanstack/react-query";
import { optimizeNote } from "../../api/notesAPI";
import type { NoteDTO } from "../../types/noteDTO";
import type { OptimizeNoteDTO } from "../../types/optimizeNoteDTO";

interface OptimizeNoteParams {
  noteId: string;
  optimizeDto: OptimizeNoteDTO;
}

export function useOptimizeNote() {
  const queryClient = useQueryClient();

  const mutation = useMutation<NoteDTO, Error, OptimizeNoteParams>({
    mutationFn: ({ noteId, optimizeDto }) => optimizeNote(noteId, optimizeDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    optimizedNote: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    optimizeNote: (noteId: string, subjectCode: string, courseCode: string) =>
      mutation.mutate({
        noteId,
        optimizeDto: { subjectCode, courseCode },
      }),
  };
}
