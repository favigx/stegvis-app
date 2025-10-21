import type { CourseInterface } from "./course";

export interface SubjectInterface {
  code: string;
  name: string;
  points: string;
  courses: CourseInterface[];
  color?: string;
}