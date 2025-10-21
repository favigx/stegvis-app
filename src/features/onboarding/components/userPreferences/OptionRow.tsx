import { ChoiceButton } from "./Choicebutton";
import { CourseDropdown } from "./CourseDropdown";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import type { EnumButtonOption } from "../../types/props/props";
import styles from "./PreferenceChoice.module.css";

interface OptionRowProps {
  option: EnumButtonOption;
  isSelected: (code: string) => boolean;
  handleSelect: (code: string | string[]) => void;
  toggle: (name: string) => void;
  open: string | null;
  current?: boolean;
  onCourseSelect?: (code: string, points: number) => void;
  variant?: "default" | "green";
}

export function OptionRow({
  option,
  isSelected,
  handleSelect,
  toggle,
  open,
  current = false,
  onCourseSelect,
  variant = "default",
}: OptionRowProps) {
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const gradedSubjects: { courseCode: string }[] = persistedPrefs?.gradedSubjects ?? [];

  // --- Räkna betygsatta kurser ---
  const gradedCount = option.courses
    ? option.courses.filter(c => gradedSubjects.some(g => g.courseCode === c.code)).length
    : 0;
  const totalCourses = option.courses?.length ?? 0;

  const allCoursesGraded = totalCourses > 0 && gradedCount === totalCourses;
  const partiallyGraded = gradedCount > 0 && gradedCount < totalCourses;

  // --- Kolla om ämnet är "selected" eller alla kurser är klara ---
  const optionIsSelected = (): boolean => {
    if (isSelected(option.code)) return true;
    if (option.courses) {
      return option.courses.some(c => isSelected(c.code)) || allCoursesGraded;
    }
    return false;
  };

  // --- Klass baserat på grading ---
const buttonClassNames = [
  current ? styles.current : "",
  optionIsSelected()
    ? variant === "green"
      ? styles.selectedGreen
      : styles.selected
    : variant === "green"
    ? styles.unselectedGreen
    : styles.unselected,
  allCoursesGraded
    ? variant === "green"
      ? styles.allGradedGreen
      : styles.allGraded
    : partiallyGraded
    ? styles.partiallyGraded
    : "",
].filter(Boolean).join(" ");


 const buttonLabel = option.courses && totalCourses > 0
  ? `${option.name} (${gradedCount}/${totalCourses})`
  : option.name;

  return (
    <div className={styles.optionWrapper}>
      <ChoiceButton
        name={buttonLabel}
        selected={optionIsSelected()} // ✅ Nu markerar både selected & allCoursesGraded
        onClick={() =>
          option.courses ? toggle(option.name) : handleSelect(option.code)
        }
        className={buttonClassNames}
      />

      <CourseDropdown
        option={option}
        isOpen={open === option.name}
        isSelected={isSelected}
        onCourseSelect={onCourseSelect}
      />
    </div>
  );
}
