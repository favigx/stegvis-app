import type { ProgramPreference } from "./programPreference";
import type { OrientationPreference } from "./orientationPreference";

export interface AddOnboardingPreferencesResponse {
  educationLevel: string | null;
  program: ProgramPreference | null;
  orientation: OrientationPreference | null;
  year: number | null;
}