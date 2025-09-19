import { useQuery } from "@tanstack/react-query";
import { getNotesCount } from "../api/notesAPI";

export function useGetNotesCount() {
  return useQuery<number, Error>({
    queryKey: ["notesCount"],
    queryFn: getNotesCount, // samma som din api-funktion
  });
}
