import { useQuery } from "@tanstack/react-query";
import { getAllUserQuizzesByCourseName } from "../api/quizAPI"; 
import type { NoteQuizResponse } from "../types/noteQuizResponse";

export function useAllUserQuizzesByCourseName(courseName: string) {
  return useQuery<NoteQuizResponse[], Error>({
    queryKey: ["noteQuizzesByCourse", courseName],
    queryFn: () => getAllUserQuizzesByCourseName(courseName),
    enabled: !!courseName,
  });
}