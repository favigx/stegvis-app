import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { EnumButtonOption } from "../../types/props/props";
import type { RootState } from "../../../../redux/store";
import styles from "./PreferenceChoice.module.css";

interface CourseDropdownProps {
  option: EnumButtonOption;
  isOpen: boolean;
  onClose?: () => void;
  isSelected: (code: string) => boolean;
  onCourseSelect?: (code: string, points: number) => void;
}

export function CourseDropdown({
  option,
  isOpen,
  onClose,
  isSelected,
  onCourseSelect,
}: CourseDropdownProps) {
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const gradedSubjects: { courseCode: string }[] = persistedPrefs?.gradedSubjects ?? [];

  const ref = useRef<HTMLDivElement>(null);

  // stäng dropdown om man klickar utanför
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!option.courses || !isOpen) return null;

  return (
    <div ref={ref} className={styles.dropdown} role="list">
      {option.courses.map((course) => {
        const isGraded = gradedSubjects.some(g => g.courseCode === course.code);
        const courseLabel = `${course.name} (${course.code}, ${course.points ?? 0} p)`;

        // wrapper blir grön om redan graderad, blå om användaren valt
        const classNames = [
          styles.courseButton,
          isGraded ? styles.disabledCourse : "",
          isSelected(course.code) && !isGraded ? styles.userSelected : "",
        ].join(" ").trim();

        return (
          <div key={course.code} className={classNames}>
            <button
              type="button"
              className={styles.courseInnerButton}
              onClick={() => {
                if (isGraded) return; // ingen klick för graded
                onCourseSelect?.(course.code, Number(course.points ?? 0));
                onClose?.(); // stäng dropdown efter val
              }}
              disabled={isGraded}
              aria-disabled={isGraded}
            >
              <span className={styles.courseLabel}>{courseLabel}</span>
              {isGraded && <span className={styles.courseCheck}>✓</span>}
            </button>
          </div>
        );
      })}
    </div>
  );
}