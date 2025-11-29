import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { markOnboardingComplete } from "../api/userPreferences/userPreferencesAPI";
import { setHasCompletedOnboarding } from "../../../redux/slices/authSlice"; 

export function useMarkOnboardingComplete() {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["markOnboardingComplete"],
    mutationFn: markOnboardingComplete,

    onSuccess: () => {
      dispatch(setHasCompletedOnboarding(true));
    },

    onError: (error) => {
      console.error("Failed to mark onboarding complete:", error);
    },
  });
}
