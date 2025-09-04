import { useCallback } from "react";

const LOCKED_OPTIONS = ['Skolnivå'];

export function useSelectionHandler(
  selected: string | string[] | null,
  onSelect: (value: string | string[]) => void,
  multiple: boolean,
  toggleDropdown?: (name: string) => void
) {
  return useCallback(
    (val: string | string[]) => {
      const values = Array.isArray(val) ? val : [val];

      if (values.some(v => LOCKED_OPTIONS.includes(v))) {
        onSelect(values.length === 1 ? values[0] : values);
        return;
      }

      if (multiple) {
        const selectedArray = Array.isArray(selected) ? [...selected] : selected ? [selected] : [];

        values.forEach(v => {
          const index = selectedArray.indexOf(v);
          if (index > -1) {
            selectedArray.splice(index, 1);
          } else {
            selectedArray.push(v);
          }
        });

        onSelect(selectedArray);
      } else {
        onSelect(values[0]);
      }

      if (toggleDropdown) toggleDropdown(values[0]);
    },
    [selected, onSelect, multiple, toggleDropdown]
  );
}
