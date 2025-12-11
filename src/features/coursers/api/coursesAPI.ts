import { AxiosError } from "axios";
import { apiClient } from "../../../api/apiClient";
import type { AvailableCourses, CourseResponse } from "../types/courses";

export async function getCourseByLevel(
  courseName: AvailableCourses,
  level: string
): Promise<CourseResponse> {
  try {
    const response = await apiClient.get(`/courses/${courseName}/${level}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Kunde inte hämta kursen";
      throw new Error(message);
    }

    throw new Error("Kunde inte nå servern");
  }
}
