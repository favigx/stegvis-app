import { GraduationCap, BookOpen, Layers, Calendar, UserRoundPen } from "lucide-react";
import { useState, type JSX } from "react";
import type { UserPreference } from "../types/userPreferences/userPreferences"; 
import type { OrientationPreference } from "../types/userPreferences/orientationPreference";
import type { ProgramPreference } from "../types/userPreferences/programPreference";
import styles from "./OnboardingSidebar.module.css";

interface OnboardingSidebarProps {
  onEdit?: () => void;
  userPrefs: UserPreference;
  availableOrientations?: OrientationPreference[]; // objekt-array
}

function OnboardingSidebar({ onEdit, userPrefs, availableOrientations }: OnboardingSidebarProps) {
  const [selected, setSelected] = useState<string | null>(null);

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
      className={`${styles.iconTextButton} ${!disableSelect && selected === id ? styles.selected : ""}`}
      onClick={() => {
        if (!disableSelect) setSelected(id ?? null);
        onClick?.();
      }}
      disabled={disableSelect}
    >
      <span className={`${styles.iconButton} ${iconClass ?? ""}`}>{icon}</span>
      <span className={`${styles.navText} ${textColorClass ?? ""}`}>{text}</span>
    </button>
  );

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {/* Redigera utbildning */}
        <IconTextButton
          icon={<UserRoundPen size={20} />}
          text="Min utbildning"
          iconClass={styles.add}
          id="edit"
          disableSelect={true}
          textColorClass={styles.addText}
          onClick={onEdit}
        />

        {/* Skolnivå */}
        <IconTextButton
          icon={<GraduationCap size={20} />}
          text={userPrefs.educationLevel || "—"}
          iconClass={styles.educationLevelIcon}
          disableSelect={true}
        />

        {/* Program */}
        <IconTextButton
          icon={<BookOpen size={20} />}
          text={
            userPrefs.program
              ? `${userPrefs.program.name} (${userPrefs.program.code})`
              : "—"
          }
          iconClass={styles.fieldOfStudyIcon}
          disableSelect={true}
        />

        {/* Orientering */}
        {availableOrientations && availableOrientations.length > 0 && (
          <IconTextButton
            icon={<Layers size={20} />}
            text={
              userPrefs.orientation
                ? `${userPrefs.orientation.name} (${userPrefs.orientation.code})`
                : "—"
            }
            iconClass={styles.orientationIcon}
            disableSelect={true}
          />
        )}

        {/* År */}
        <IconTextButton
          icon={<Calendar size={20} />}
          text={userPrefs.year?.toString() || "—"}
          iconClass={styles.yearIcon}
          disableSelect={true}
        />
      </nav>
    </aside>
  );
}

export default OnboardingSidebar;
