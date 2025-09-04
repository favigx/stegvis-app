import type { SubjectInterface } from "../types/skolverket/subject";

export const mapSubjectsToOptions = (subjects: SubjectInterface[]) =>
  subjects.map(subj => ({
    name: subj.name,
    code: subj.code,
    points: subj.points,
    courses: subj.courses?.map(course => ({
      name: course.name,
      code: course.code,
      points: course.points,
    })),
  }));