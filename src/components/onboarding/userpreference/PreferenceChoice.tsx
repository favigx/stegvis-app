import { useState } from 'react';
import { useDropdown } from '../hooks/useDropdown';
import { SearchInput } from './SearchInput';
import { useFilterOptions } from '../hooks/useFilterOptions';
import { useSelectionHandler } from '../hooks/useSelectionHandler';
import { OptionRow } from './OptionRow';
import type { EnumButtonsProps, EnumButtonOption } from '../types/types';
import styles from './PreferenceChoice.module.css';

export function PreferenceChoice({
  title,
  options,
  selected,
  onSelect,
  multiple = false,
  searchable = false
}: EnumButtonsProps) {
  const [search, setSearch] = useState('');
  const { open, toggle, ref } = useDropdown();

  const filteredOptions = useFilterOptions(options, search, searchable);

  const isSelected = (name: string): boolean => {
    if (!selected) return false;
    const selectedArray = Array.isArray(selected) ? selected : [selected];
    return selectedArray.includes(name);
  };

  const handleSelect = useSelectionHandler(selected, onSelect, multiple, toggle);

  return (
    <div className={styles.buttonContainer} ref={ref}>
      <div className={styles.row}>
        <div className={styles.title}>{title}</div>

        {searchable && (
          <SearchInput
            placeholder={`Sök ${title.toLowerCase()}...`}
            value={search}
            onChange={setSearch}
          />
        )}

        <div className={`${styles.container} ${searchable ? styles.scrollable : ''}`}>
          {filteredOptions.map((opt: EnumButtonOption) => (
            <OptionRow
              key={opt.code}
              option={opt}
              isSelected={isSelected}
              handleSelect={handleSelect}
              toggle={toggle}
              open={open}
            />
          ))}
        </div>
      </div>
    </div>
  );
}