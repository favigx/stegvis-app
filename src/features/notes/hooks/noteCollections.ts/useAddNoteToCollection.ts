import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddNoteToCollectionResponse } from "../../types/noteCollections/addNoteToCollectionResponse";
import type { AddNoteToCollectionDTO } from "../../types/noteCollections/addNoteToCollectionDTO";
import { addNoteToCollection } from "../../api/noteCollections";

export function useAddNoteToCollection() {
  const queryClient = useQueryClient();

  return useMutation<AddNoteToCollectionResponse, Error, AddNoteToCollectionDTO>({
    mutationFn: (dto: AddNoteToCollectionDTO) => addNoteToCollection(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["noteCollection", data.id] });
    },
  });
}