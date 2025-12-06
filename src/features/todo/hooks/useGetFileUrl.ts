import { useQuery } from "@tanstack/react-query";
import { getFileUrl } from "../api/todoAPI";

export function useGetFileUrl(todoFileId: string) {
  return useQuery<string>({
    queryKey: ["todoFileUrl", todoFileId],
    queryFn: () => getFileUrl(todoFileId),
    staleTime: 1000 * 60, // 1 minut
  });
}
