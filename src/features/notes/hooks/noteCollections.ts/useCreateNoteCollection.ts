import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddNoteCollectionResponse } from "../../types/noteCollections/addNoteCollectionResponse";
import type { AddNoteCollectionDTO } from "../../types/noteCollections/addNoteCollectionDTO";
import { createNoteCollection } from "../../api/noteCollections";

export function useCreateNoteCollection() {
  const queryClient = useQueryClient();

  return useMutation<AddNoteCollectionResponse, Error, AddNoteCollectionDTO>({
    mutationFn: (dto: AddNoteCollectionDTO) => createNoteCollection(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteCollections"] });
    },
  });
}