import { ChoiceButton } from './Choicebutton'; 
import type { CourseDropdownProps } from '../../types/props/props'; 
import styles from './PreferenceChoice.module.css';

export function CourseDropdown({ option, isOpen, isSelected, onSelect }: CourseDropdownProps) {
  if (!option.courses || !isOpen) return null;

  return (
    <div className={styles.dropdown}>
      {/* Main subject */}
      <ChoiceButton
        name={`${option.name} (${option.code}, ${option.points ?? 0} p)`}
        selected={isSelected(option.name)}
        onClick={() => onSelect(option.name)}
        className={styles.courseButton}
      />

      {/* Courses for main subject */}
      {option.courses.map(course => (
        <ChoiceButton
          key={course.code}
          name={`${course.name} (${course.code}, ${course.points ?? 0} p)`}
          selected={isSelected(course.name)}
          onClick={() => onSelect(course.name)}
          className={styles.courseButton}
        />
      ))}
    </div>
  );
}
