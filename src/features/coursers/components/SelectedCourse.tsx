import type { ChosenCourse } from "../Courses";
import { useGetCourseByLevel } from "../hooks/useGetCourseByLevel";

interface Props {
  selectedCourse: ChosenCourse;
}

function SelectedCourse({ selectedCourse }: Props) {
  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByLevel(selectedCourse.course, selectedCourse.level);

  if (isLoading) return <p>Laddar kurs..</p>;

  if (error) return <p>Kunde inte hämta kurs</p>;

  if (course)
    return (
      <div>
        {course.questionGroups.map((group) => (
          <div key={group.index + group.title}>
            <div dangerouslySetInnerHTML={{ __html: group.contentHtml }} />
          </div>
        ))}
      </div>
    );
}

export default SelectedCourse;
