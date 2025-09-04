import { PreferenceChoice } from "./userPreferences/PreferenceChoice";
import type { EnumButtonOption } from "../types/props/props"; 

interface PreferenceSectionProps {
  title: string;
  options: EnumButtonOption[];
  selected: string | string[] | null;
  onSelect: (val: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
}

export function PreferenceSection({
  title,
  options,
  selected,
  onSelect,
  multiple = false,
  searchable = false
}: PreferenceSectionProps) {
  return (
    <PreferenceChoice
      title={title}
      options={options}
      selected={selected}
      onSelect={onSelect}
      multiple={multiple}
      searchable={searchable}
    />
  );
}