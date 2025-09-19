import { useState, type JSX } from "react";
import { Filter, Plus } from "lucide-react"; // NotebookPlus som "Add Note"-ikon
import styles from "./SearchToolbar.module.css";

interface SearchToolbarProps {
  subjects: string[];
  filter: {
    search?: string;
    subject?: string;
    fromDate?: string;
    toDate?: string;
  };
  onFilterChange: (filter: any) => void;
  onAddNote: () => void;
}

export function SearchToolbar({ subjects, filter, onFilterChange, onAddNote }: SearchToolbarProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (key: string, value: string) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const IconButton = ({ icon, onClick }: { icon: JSX.Element; onClick: () => void }) => (
    <button className={styles.iconButton} onClick={onClick}>
      {icon}
    </button>
  );

  return (
    <div className={styles.toolbarContainer}>
      {/* Sökfält */}
      <input
        type="text"
        placeholder="Sök"
        className={styles.searchInput}
        value={filter.search || ""}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      {/* Filterikon */}
      <IconButton icon={<Filter size={19} color="#3a536e" />} onClick={() => setOpen(!open)} />

      {/* Lägg till-knapp */}
      <IconButton icon={<Plus size={19} color="#101620ff" />} onClick={onAddNote} />

      {/* Dropdown för filter */}
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownItem}>
            <label>Ämne:</label>
            <select
              value={filter.subject || ""}
              onChange={(e) => handleChange("subject", e.target.value)}
            >
              <option value="">Alla ämnen</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={styles.dropdownItem}>
            <label>Från datum:</label>
            <input
              type="date"
              value={filter.fromDate || ""}
              onChange={(e) => handleChange("fromDate", e.target.value)}
            />
          </div>

          <div className={styles.dropdownItem}>
            <label>Till datum:</label>
            <input
              type="date"
              value={filter.toDate || ""}
              onChange={(e) => handleChange("toDate", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
