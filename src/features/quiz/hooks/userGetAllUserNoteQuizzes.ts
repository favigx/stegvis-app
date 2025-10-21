import { useQuery } from "@tanstack/react-query";
import { getAllUserNoteQuizzes } from "../api/quizAPI"; 
import type { NoteQuizResponse } from "../types/noteQuizResponse";

export function useAllUserNoteQuizzes() {
  return useQuery<NoteQuizResponse[], Error>({
    queryKey: ["noteQuizzes"],
    queryFn: getAllUserNoteQuizzes,
  });
}
