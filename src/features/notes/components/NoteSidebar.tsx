import { useState, type JSX } from "react";
import { 
  Plus, Search, CircleX, Calendar1, CalendarArrowUp, CalendarArrowDown, 
  LayoutGrid, Folder 
} from "lucide-react";
import styles from './NoteSidebar.module.css';
import NoteCollectionsList from "./NoteCollectionList";

interface NotesidebarProps {
  onAdd?: () => void;
  onSearch?: (query: string) => void;
  onToday?: () => void;
  onSelectCategory?: (category: string) => void; // ← ny prop
}

function Notesidebar({ onAdd, onSearch, onToday, onSelectCategory }: NotesidebarProps) {
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selected, setSelected] = useState<string | null>("all"); // default: Alla

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    onSearch?.(v);
  }

  const IconTextButton = ({
    icon,
    text,
    iconClass,
    onClick,
    id,
    disableSelect = false,
    textColorClass,
  }: {
    icon: JSX.Element;
    text: string;
    iconClass?: string;
    onClick?: () => void;
    id?: string;
    disableSelect?: boolean;
    textColorClass?: string;
  }) => (
    <button
      className={`${styles.iconTextButton} ${
        !disableSelect && selected === id ? styles.selected : ""
      }`}
      onClick={() => {
        if (!disableSelect) {
          setSelected(id ?? null);
          onSelectCategory?.(text); // ← skicka upp texten
        }
        onClick?.();
      }}
    >
      <span className={`${styles.iconButton} ${iconClass ?? ""}`}>{icon}</span>
      <span className={`${styles.navText} ${textColorClass ?? ""}`}>{text}</span>
    </button>
  );

  const isSearchSelected = isSearchFocused || query !== "";

  function onSelectCollection(_collectionId: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <IconTextButton
          icon={<Plus size={20} />}
          text="Lägg till anteckning"
          iconClass={styles.add}
          id="add"
          disableSelect={true}
          textColorClass={styles.addText}
          onClick={onAdd}
        />
        <div
          className={`${styles.iconTextButton} ${
            isSearchSelected ? styles.selected : ""
          }`}
        >
          <span className={`${styles.iconButton} ${styles.searchIcon}`}>
            <Search size={18} />
          </span>

          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="Sök"
            className={styles.searchInput}
            autoFocus={isSearchFocused}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />

          {query && (
            <span
              className={styles.clearButton}
              onClick={() => setQuery("")}
            >
              <CircleX size={18} />
            </span>
          )}
        </div>
        <IconTextButton
          icon={<LayoutGrid size={20} />}
          text="Alla"
          iconClass={styles.todayIcon}
          id="all"
        />

        <IconTextButton
          icon={<Calendar1 size={20} />}
          text="Idag"
          iconClass={styles.todayIcon}
          id="today"
          onClick={onToday}
        />

        <IconTextButton
          icon={<CalendarArrowUp size={20} />}
          text="Senaste veckan"
          iconClass={styles.todayIcon}
          id="week"
        />

        <IconTextButton
          icon={<CalendarArrowUp size={20} />}
          text="Senaste månaden"
          iconClass={styles.todayIcon}
          id="month"
        />

        <IconTextButton
          icon={<CalendarArrowDown size={20} />}
          text="Äldre än 1 månad"
          iconClass={styles.todayIcon}
          id="older"
        />
        <div className={styles.sectionHeader}>
          <span className={`${styles.iconButton}`}>
            <Folder size={22} />
          </span>
          <span className={styles.sectionText}>Collections</span>
      
        </div>
          <NoteCollectionsList
          onSelectCollection={onSelectCollection}
        />
      </nav>
    </aside>
  );
}

export default Notesidebar;
