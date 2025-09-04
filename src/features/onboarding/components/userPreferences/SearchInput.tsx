import styles from './PreferenceChoice.module.css';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

export function SearchInput({ placeholder, value, onChange }: SearchInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={styles.searchInput}
    />
  );
}