import { useState, useRef } from "react";
import { Search, CircleX } from "lucide-react";
import { useDropdown } from "../../hooks/useDropdown";
import { useFilterOptions } from "../../hooks/useFilterOptions";
import { useSelectionHandler } from "../../hooks/useSelectionHandler";
import { OptionRow } from "./OptionRow";
import type { EnumButtonsProps } from "../../types/props/props";
import styles from "./PreferenceChoice.module.css";

interface PreferenceChoiceProps extends EnumButtonsProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  currentGrade?: string | null;
  onCourseSelect?: (code: string, points: number) => void;
  variant?: "default" | "green"; // 💚 ny prop
}

export function PreferenceChoice({
  title,
  options,
  selected,
  onSelect,
  onCourseSelect,
  multiple = false,
  searchable = false,
  searchValue,
  onSearchChange,
  currentGrade = null,
  variant = "default", 
}: PreferenceChoiceProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const search = searchValue ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { open, toggle, ref } = useDropdown();

  const filteredOptions = useFilterOptions(options, search, searchable);

  const displayedOptions =
    searchable && search.trim() === "" && selected
      ? options.filter((opt) =>
          Array.isArray(selected)
            ? selected.includes(opt.code)
            : opt.code === selected
        )
      : filteredOptions;

  const isSelected = (code: string): boolean => {
    if (!selected) return false;
    const selectedArray = Array.isArray(selected) ? selected : [selected];
    return selectedArray.includes(code);
  };

  const handleSelectInternal = useSelectionHandler(selected, onSelect, multiple, toggle);

  const handleSelectAndClear = (code: string | string[]) => {
    handleSelectInternal(code);
    if (searchable) {
      setSearch("");
      inputRef.current?.blur();
    }
  };

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isSearchActive = searchable && (search.trim() !== "" || isSearchFocused);

  return (
    <div
      ref={ref}
      className={`${styles.buttonContainer} ${variant === "green" ? styles.green : ""}`}
    >
      <div className={styles.row}>
        <div className={styles.title}>{title}</div>

        {searchable && (
          <div
            className={`${styles.searchWrapper} ${
              isSearchActive ? styles.searchSelected : ""
            }`}
          >
            <span className={styles.searchIconWrapper}>
              <Search size={18} />
            </span>
            <input
              ref={inputRef}
              placeholder="Sök program"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {search && (
              <span className={styles.clearButton} onClick={() => setSearch("")}>
                <CircleX size={18} />
              </span>
            )}
          </div>
        )}

        <div
          className={`${styles.container} ${
            searchable ? styles.scrollable : ""
          } ${title === "Program" ? styles.programContainer : ""}`}
        >
          {displayedOptions.map((opt) => {
            const isCurrent = opt.code === currentGrade;
            return (
              <OptionRow
                key={opt.code}
                option={opt}
                isSelected={isSelected}
                handleSelect={handleSelectAndClear}
                toggle={toggle}
                open={open}
                current={isCurrent}
                onCourseSelect={onCourseSelect}
                variant={variant} // 💚 skickas vidare till OptionRow
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
