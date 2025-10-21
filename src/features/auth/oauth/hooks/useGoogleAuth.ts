import { useQuery } from "@tanstack/react-query";
import { getGoogleAuthUrl } from "../api/oAuthAPI";

export function useGoogleAuthUrl() {
  return useQuery<string, Error>({
    queryKey: ["googleAuthUrl"],
    queryFn: () => getGoogleAuthUrl(),
    staleTime: 1000 * 60 * 5, // 5 minuter
  });
}
