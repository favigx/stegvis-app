import { useQuery } from "@tanstack/react-query";
import type { AvailableCourses, CourseResponse } from "../types/courses";
import { getCourseByLevel } from "../api/coursesAPI";

export function useGetCourseByLevel(
  courseName: AvailableCourses,
  level: string
) {
  return useQuery<CourseResponse, Error>({
    queryKey: ["course", courseName, level],
    queryFn: () => getCourseByLevel(courseName, level),
    staleTime: 1000 * 60 * 5,
  });
}
