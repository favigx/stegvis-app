import { useQuery } from "@tanstack/react-query";
import { getUserNoteQuizById } from "../api/quizAPI";
import type { NoteQuizResponse } from "../types/noteQuizResponse";

export function useLoadQuizById(quizId: string) {
  return useQuery<NoteQuizResponse, Error>({
    queryKey: ["noteQuiz", quizId],
    queryFn: () => getUserNoteQuizById(quizId),
    enabled: !!quizId,
  });
}
