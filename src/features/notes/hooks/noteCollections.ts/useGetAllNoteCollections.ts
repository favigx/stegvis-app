import { useQuery } from "@tanstack/react-query";
import type { NoteCollectionDTO } from "../../types/noteCollections/noteCollectionDTO";
import { getAllNoteCollections } from "../../api/noteCollections";

export function useGetAllNoteCollections() {
  return useQuery<NoteCollectionDTO[], Error>({
    queryKey: ["noteCollections"],
    queryFn: () => getAllNoteCollections(),
    staleTime: 1000 * 60 * 5, 
  });
}
