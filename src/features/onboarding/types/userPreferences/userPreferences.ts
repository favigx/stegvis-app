export interface UserPreference {
    educationLevel: string | null;
    fieldOfStudy: string | null;
    orientation: string | null;
    grades: string[] | null;
    year: number | null;
    subjects: string[] | null;
    focusDays: string[] | null;
    dailyGoal: number | null;
    helpRequests: string[] | null;
}