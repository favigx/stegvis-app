import { useState, type JSX } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, LayoutGrid, Plus } from "lucide-react";
import styles from './QuizSidebar.module.css';
import type { RootState } from "../../../redux/store";
import { getUniqueSubjectColor } from "../../notes/utils/getSubjectColor";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";

interface QuizSidebarProps {
  onSelectCategory?: (category: string) => void;
  onAdd?: () => void;
}

function QuizSidebar({ onSelectCategory, onAdd }: QuizSidebarProps) {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const subjects: SubjectPreference[] = persistedPrefs.subjects ?? [];

  const [selected, setSelected] = useState<string>("all");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "folder1": true,
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const IconTextButton = ({
    icon,
    text,
    id,
    nested = false,
    iconClass,
    disableSelect = false,
    textColorClass,
    onClick,
  }: {
    icon?: JSX.Element;
    text: string;
    id: string;
    nested?: boolean;
    iconClass?: string;
    disableSelect?: boolean;
    textColorClass?: string;
    onClick?: () => void;
  }) => (
    <button
      className={`${styles.iconTextButton} ${nested ? styles.nested : ""} ${
        !disableSelect && selected === id ? styles.selected : ""
      } ${disableSelect ? styles.disabledButton : ""}`}
      onClick={() => {
        if (!disableSelect) setSelected(id);
        onClick?.();
        if (!disableSelect) onSelectCategory?.(id);
      }}
    >
      {icon && <span className={`${styles.iconButton} ${iconClass ?? ""}`}>{icon}</span>}
      <span className={`${styles.navText} ${textColorClass ?? ""}`}>{text}</span>
    </button>
  );

  const isSubfolderActive = (nestedIds: string[]) => nestedIds.includes(selected);

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {/* Skapa quiz */}
        <IconTextButton
          icon={<Plus size={20} />}
          text="Skapa quiz"
          iconClass={styles.add}
          id="add"
          disableSelect={true}
          textColorClass={styles.addText}
          onClick={onAdd}
        />

        {/* Alla */}
        <IconTextButton
          icon={<LayoutGrid size={20} />}
          text="Alla"
          iconClass={styles.todayIcon}
          id="all"
        />

        {/* Ämnen */}
        <div className={styles.folder}>
          <div
            className={styles.folderHeader}
            onClick={() => toggleFolder("folder1")}
          >
            <span className={styles.navText}>Ämnen</span>
            <ChevronDown
              className={`${styles.chevron} ${expandedFolders["folder1"] ? styles.open : ""}`}
            />
          </div>

          {expandedFolders["folder1"] && (
            <div className={styles.folderContent}>
              {subjects.map((subject, index) => {
                const subIds = [`sub-${index}-quiz`, `sub-${index}-flashcards`];
                const color = getUniqueSubjectColor(subject.courseCode);

                return (
                  <div
                    key={subject.courseCode}
                    className={`${styles.subFolder} ${isSubfolderActive(subIds) ? styles.active : ""}`}
                  >
                    <div className={styles.subFolderHeader}>
                      <div className={styles.subjectBanner}>
                        <span
                          className={styles.subjectCircle}
                          style={{ backgroundColor: color }}
                        />
                        {subject.courseName}
                      </div>
                    </div>
                    <IconTextButton text="Quiz" id={subIds[0]} nested />
                    <IconTextButton text="Flashcards" id={subIds[1]} nested disableSelect />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default QuizSidebar;
