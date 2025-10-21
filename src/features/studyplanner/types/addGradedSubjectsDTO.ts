export interface AddGradedSubjectDTO {
  courseName: string;
  courseCode: string;
  coursePoints: number;
}

// 🧮 Listan av ämnen
export type AddGradedSubjectsDTO = AddGradedSubjectDTO[];