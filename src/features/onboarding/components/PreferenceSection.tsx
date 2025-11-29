// PreferenceSection.tsx
import { PreferenceChoice } from "./userPreferences/PreferenceChoice"; 
import type { EnumButtonOption } from "../types/props/props"; 

interface PreferenceSectionProps {
  title: string;
  options: EnumButtonOption[];
  selected: string | string[] | null;
  onSelect?: (val: string | string[]) => void;
  onCourseSelect?: (code: string, points: number) => void;
  multiple?: boolean; 
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  currentGrade?: string | null;
  variant?: "default" | "green";
}

export function PreferenceSection({
  title,
  options,
  selected,
  onSelect,
  onCourseSelect,
  searchable = false,
  searchValue,
  onSearchChange,
  currentGrade,
  multiple,
  variant = "default",
}: PreferenceSectionProps) {
  return (
    <PreferenceChoice
      title={title}
      options={options}
      selected={selected}
      onSelect={onSelect ?? (() => {})}
      onCourseSelect={onCourseSelect}
      searchable={searchable}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      currentGrade={currentGrade}
      multiple={multiple}
      variant={variant}
    />
  );
}