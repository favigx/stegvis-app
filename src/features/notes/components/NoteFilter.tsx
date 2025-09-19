import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import styles from "./NoteFilter.module.css";

interface NoteFilterProps {
  subjects: string[];
  onFilterChange: (filter: {
    search?: string;
    subject?: string;
    fromDate?: string;
    toDate?: string;
  }) => void;
}

export function NoteFilter({ subjects, onFilterChange }: NoteFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    const isoFromDate = fromDate ? new Date(fromDate).toISOString() : undefined;
    let isoToDate: string | undefined = undefined;
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999);
      isoToDate = toDateObj.toISOString();
    }

    onFilterChange({ search, subject, fromDate: isoFromDate, toDate: isoToDate });
  }, [search, subject, fromDate, toDate, onFilterChange]);

  return (
    <div className={styles.filterWrapper}>
      <input
        type="text"
        placeholder="Sök"
        className={styles.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      <Filter
        size={24}
        className={styles.filterIcon}
        onClick={() => setOpen(!open)}
      />
      
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownItem}>
            <label>Ämne:</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Alla ämnen</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dropdownItem}>
            <label>Från datum:</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>

          <div className={styles.dropdownItem}>
            <label>Till datum:</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}
