import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateNoteQuiz } from "../../api/notesAPI";
import type { NoteQuizResponse } from "../../../quiz/types/noteQuizResponse";

interface GenerateQuizParams {
  noteId: string;
}

export function useGenerateNoteQuiz() {
  const queryClient = useQueryClient();

  const mutation = useMutation<NoteQuizResponse, Error, GenerateQuizParams>({
    mutationFn: ({ noteId }) => generateNoteQuiz(noteId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["noteQuizzes"] });
      queryClient.setQueryData(["noteQuiz", data.id], data);
    },
  });

  return {
    generatedQuiz: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    generateQuiz: (
      noteId: string,
      callbacks: {
        onSuccess: (quiz: NoteQuizResponse) => void | Promise<void>;
        onError?: (...args: any[]) => void;
      }
    ) => mutation.mutate({ noteId }, callbacks),
  };
}
