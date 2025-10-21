import type { OrientationPreference } from "./orientationPreference";
import type { ProgramPreference } from "./programPreference";

export interface AddOnboardingPreferencesDTO {
  educationLevel: string | null;
  program: ProgramPreference | null;
  orientation: OrientationPreference | null;
  year: number | null;
}