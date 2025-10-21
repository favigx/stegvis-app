import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject"; 

export interface AddSubjectPreferencesGradeResponse {
    subjects: GradedSubject[];
    meritValue: number;
}