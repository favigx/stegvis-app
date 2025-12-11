export interface CourseResponse {
  id: string;
  course: AvailableCourses;
  level: string;
  questionGroups: CourseQuestionGroup[];
}

export type AvailableCourses = "AI";

export interface CourseQuestionGroup {
  index: number;
  key: string;
  title: string;
  contentHtml: string;
  questions: CourseQuestion[];
}

export interface CourseQuestion {
  id: string;
  index: number;
  label: string;
  alternatives: CourseAlternative[];
}

export interface CourseAlternative {
  id: string;
  label: string;
}
