import type { SubjectResponse } from "../../onboarding/types/skolverket/subjectResponse"; 
import type { CourseInterface } from "../../onboarding/types/skolverket/course";

export function getAllCourses(subjectResponse: SubjectResponse): CourseInterface[] {
  const courses: CourseInterface[] = [];

  const program = subjectResponse.program;

  const containers = [
    program.foundationSubjects,
    program.programmeSpecificSubjects,
    program.specialization
  ];

  containers.forEach(container => {
    if (container?.subjects?.length) {
      container.subjects.forEach(subject => {
        if (subject.courses?.length) {
          subject.courses.forEach(course => {
            courses.push({
              code: course.code,
              name: course.name,
              points: course.points
            });
          });
        }
      });
    }
  });

  return courses;
}
