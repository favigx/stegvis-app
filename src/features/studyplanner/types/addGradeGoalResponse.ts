import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";

export interface AddGradeGoalResponse {
    subjects: SubjectPreference[];
    meritValueBasedOnGoal: number;
}