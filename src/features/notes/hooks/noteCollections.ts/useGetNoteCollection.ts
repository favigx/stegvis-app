import { useQuery } from "@tanstack/react-query";
import type { NoteCollectionDTO } from "../../types/noteCollections/noteCollectionDTO";
import { getNoteCollection } from "../../api/noteCollections";

export function useGetNoteCollection(collectionId: string) {
  return useQuery<NoteCollectionDTO, Error>({
    queryKey: ["noteCollection", collectionId],
    queryFn: () => getNoteCollection(collectionId),
    staleTime: 1000 * 60 * 5,
  });
}