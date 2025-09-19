import { ChoiceButton } from './Choicebutton'; 
import type { CourseDropdownProps } from '../../types/props/props'; 
import styles from './PreferenceChoice.module.css';

export function CourseDropdown({ option, isOpen, isSelected, onSelect }: CourseDropdownProps) {
  if (!option.courses || !isOpen) return null;

  return (
    <div className={styles.dropdown}>
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
