import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { uploadFile } from "../api/todoAPI";
import type { UploadFileResponse } from "../types/uploadFileResponse";

export function useUploadFile(todoId: string): UseMutationResult<UploadFileResponse, Error, File> {
  const queryClient = useQueryClient();

  return useMutation<UploadFileResponse, Error, File>({
    mutationFn: (file: File) => uploadFile(todoId, file),
    onSuccess: () => {
      // Uppdatera todo-listan
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoFiles", todoId] });
    },
  });
}
