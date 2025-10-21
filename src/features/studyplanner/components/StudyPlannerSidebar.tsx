import { useState, type JSX } from "react";
import { Calendar1, Goal, BookOpen, LayoutDashboard, ListChecks, Award, GraduationCap, ChevronDown, ListTree, List } from "lucide-react"; 
import { MdFormatListBulletedAdd } from "react-icons/md";
import styles from './StudyPlannerSidebar.module.css';

interface StudyPlannerSidebarProps {
  selectedCategory: string;
  onSelectCategory?: (category: string) => void;
}

function StudyPlannerSidebar({ selectedCategory, onSelectCategory }: StudyPlannerSidebarProps) {
  // 🔹 Ämnen och kurser alltid öppet som default
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "amnen-kurser": true,
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const IconTextButton = ({
    icon,
    text,
    id,
    nested = false,
  }: {
    icon?: JSX.Element;
    text: string;
    id: string;
    nested?: boolean;
  }) => (
    <button
      className={`${styles.iconTextButton} ${nested ? styles.nested : ""} ${
        selectedCategory === id ? styles.selected : ""
      }`}
      onClick={() => {
        if (id !== selectedCategory) onSelectCategory?.(id);
      }}
    >
      {icon && <span className={styles.iconButton}>{icon}</span>}
      <span className={styles.navText}>{text}</span>
    </button>
  );

  const isSubfolderActive = (nestedIds: string[]) => nestedIds.includes(selectedCategory);

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <IconTextButton icon={<LayoutDashboard size={20} />} text="Översikt" id="oversikt" />
        <IconTextButton icon={<Calendar1 size={20} />} text="Kalender" id="kalender" />
        <IconTextButton icon={<BookOpen size={20} />} text="Planera studier" id="studier" />

        <div className={styles.folder}>
          <div
            className={styles.folderHeader}
            onClick={() => toggleFolder("amnen-kurser")}
          >
            <ListTree size={20} className={styles.iconButton} />
            <span className={styles.navText}>Ämnen och kurser</span>
            <ChevronDown size={16} className={`${styles.chevron} ${expandedFolders["amnen-kurser"] ? styles.open : ""}`} />
          </div>

          {expandedFolders["amnen-kurser"] && (
            <div className={styles.folderContent}>
              {/* Pågående */}
              <div className={`${styles.subFolder} ${styles.subFolderOngoing} ${isSubfolderActive(["amnen-kurser","mal","slutbetyg"]) ? styles.active : ""}`}>
                <div className={styles.subFolderHeader}>Pågående</div>
                <IconTextButton icon={<List size={20} />} text="Ämnen och kurser" id="amnen-kurser" nested />
                <IconTextButton icon={<Goal size={20} />} text="Betygsmål" id="mal" nested />
                <IconTextButton icon={<MdFormatListBulletedAdd size={23} />} text="Registrera slutbetyg" id="slutbetyg" nested />
              </div>

              {/* Avklarade */}
              <div className={`${styles.subFolder} ${styles.subFolderCompleted} ${isSubfolderActive(["betyg-meritvarde", "avklarade-amnen-kurser"]) ? styles.active : ""}`}>
                <div className={styles.subFolderHeader}>Avklarade</div>
                <IconTextButton icon={<ListChecks size={16} />} text="Ämnen och kurser" id="avklarade-amnen-kurser" nested />
                <IconTextButton icon={<Award size={16} />} text="Betyg och meritvärde" id="betyg-meritvarde" nested />
              </div>
            </div>
          )}
        </div>

        <IconTextButton icon={<GraduationCap size={20} />} text="Behöriga universitetsprogram" id="universitetsprogram" />
      </nav>
    </aside>
  );
}

export default StudyPlannerSidebar;
