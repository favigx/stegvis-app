import type { SubjectGrade } from "./subjectGrade";

export interface AddUserSubjectGradesResponse {
    userId: string;
    subjectGrades: SubjectGrade[];
}