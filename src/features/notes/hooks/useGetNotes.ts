import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../api/notesAPI";
import type { NoteDTO } from "../types/noteDTO";

type GetNotesParams = {
  subject?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  ascending?: boolean;
};

export function useGetNotes(params?: GetNotesParams) {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined)
      )
    : undefined;

  return useQuery<NoteDTO[], Error>({
    queryKey: ["notes", filteredParams],
    queryFn: () => getNotes(filteredParams),
  });
}
