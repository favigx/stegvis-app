import { useState } from "react";
import type { ChosenCourse } from "../Courses";
import { useGetCourseByLevel } from "../hooks/useGetCourseByLevel";
import { Button } from "../../quiz/components/Button";

interface Props {
  selectedCourse: ChosenCourse;
}

function SelectedCourse({ selectedCourse }: Props) {
  const [currentQuestionGroup, setCurrentQuestionGroup] = useState(0);
  const [hasQuestionsStarted, setHasQuestionsStarted] = useState(false);

  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByLevel(selectedCourse.course, selectedCourse.level);

  if (isLoading) return <p>Laddar kurs..</p>;

  if (error) return <p>Kunde inte hämta kurs</p>;

  if (course) {
    return (
      <div>
        {course.questionGroups.map(
          (group) =>
            group.index === currentQuestionGroup && (
              <div key={group.index + group.title}>
                {!hasQuestionsStarted && (
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: group.contentHtml }}
                    />
                    {!group.questions && (
                      <Button
                        onClick={() => {
                          setCurrentQuestionGroup((prev) => prev + 1);
                          setHasQuestionsStarted(false);
                        }}
                      >
                        Gå till nästa sektion
                      </Button>
                    )}
                    {group.questions && (
                      <div>
                        <Button onClick={() => setHasQuestionsStarted(true)}>
                          Gå till frågedelen
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {hasQuestionsStarted && group.questions && (
                  <>
                    {group.questions.map((question) => (
                      <div>{question.label}</div>
                    ))}
                  </>
                )}
              </div>
            )
        )}
      </div>
    );
  }
}

export default SelectedCourse;
