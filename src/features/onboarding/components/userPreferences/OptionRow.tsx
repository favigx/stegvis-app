import { ChoiceButton } from "./Choicebutton"; 
import { CourseDropdown } from "./CourseDropdown";
import type { EnumButtonOption } from "../../types/props/props";
import styles from './PreferenceChoice.module.css';

export function OptionRow({
  option,
  isSelected,
  handleSelect,
  toggle,
  open
}: {
  option: EnumButtonOption;
  isSelected: (name: string) => boolean;
  handleSelect: (name: string) => void;
  toggle: (name: string) => void;
  open: string | null;
}) {
  const optionIsSelected = (): boolean => {
    if (isSelected(option.name)) return true;
    if (option.courses) {
      return option.courses.some(c => isSelected(c.name));
    }
    return false;
  };

  return (
    <div className={styles.optionWrapper}>
      <ChoiceButton
        name={option.name}
        selected={optionIsSelected()}
        onClick={() => (option.courses ? toggle(option.name) : handleSelect(option.name))}
      />
      <CourseDropdown
        option={option}
        isOpen={open === option.name}
        isSelected={isSelected}
        onSelect={handleSelect}
      />
    </div>
  );
}