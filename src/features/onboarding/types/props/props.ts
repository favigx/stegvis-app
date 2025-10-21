export interface Course {
  name: string;
  code: string;
  points?: string;
}

export interface EnumButtonOption {
  name: string;
  code: string;
  points?: string;
  courses?: Course[];
}

export interface EnumButtonsProps {
  title: string;
  options: EnumButtonOption[];
  selected: string | string[] | null;
  onSelect: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
}

export interface EnumButtonProps {
  name: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CourseDropdownProps {
  option: EnumButtonOption;
  isOpen: boolean;
  isSelected: (name: string) => boolean;
  onSelect: (name: string, points: number) => void;
}
