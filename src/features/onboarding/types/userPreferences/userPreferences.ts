import type { ProgramPreference } from "./programPreference";
import type { OrientationPreference } from "./orientationPreference";
import type { SubjectPreference } from "./subjectPreference";
import type { GradedSubject } from "./gradedSubject";

export interface UserPreference {
  educationLevel: string | null;
  program: ProgramPreference | null;
  orientation: OrientationPreference | null;
  year: number | null;
  subjects?: SubjectPreference[] | null; 
  gradedSubjects?: GradedSubject[] | null; 
  meritValue?: number | null;
  meritValueBasedOnGoal?: number | null;
}