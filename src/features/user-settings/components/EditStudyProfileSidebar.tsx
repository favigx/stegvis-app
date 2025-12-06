import {
  GraduationCap,
  BookOpen,
  Layers,
  Calendar,
  UserRoundPen,
} from "lucide-react";

import { useState, type JSX } from "react";
import type { UserPreference } from "../../onboarding/types/userPreferences/userPreferences"; 
import type { OrientationPreference } from "../../onboarding/types/userPreferences/orientationPreference";
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import { getUniqueSubjectColor } from "../../notes/utils/getSubjectColor";

import styles from "./EditStudyProfileSidebar.module.css";

interface OnboardingSidebarProps {
  onEdit?: () => void;
  userPrefs: UserPreference;
  availableOrientations?: OrientationPreference[];
}

export default function EditStudyProifleSidebar({
  onEdit,
  userPrefs,
  availableOrientations,
}: OnboardingSidebarProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const gradedSubjects: GradedSubject[] = userPrefs.gradedSubjects ?? [];
  const currentSubjects: SubjectPreference[] = userPrefs.subjects ?? [];
  const meritValue = userPrefs.meritValue ?? null;

  const hasGradedSubjects = gradedSubjects.length > 0;
  const hasCurrentSubjects = currentSubjects.length > 0;

  function toggle(id: string) {
    setSelected(prev => (prev === id ? null : id));
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
        if (!disableSelect && id) toggle(id);
        onClick?.();
      }}
      disabled={disableSelect}
    >
      <span className={`${styles.iconButton} ${iconClass ?? ""}`}>{icon}</span>
      <span className={`${styles.navText} ${textColorClass ?? ""}`}>{text}</span>
    </button>
  );

  const renderSubjects = (
    subjects: {
      courseName: string;
      courseCode: string;
      grade?: string;
      gradeGoal?: string;
      coursePoints?: number;
    }[]
  ) =>
    subjects.length === 0 ? (
      <div style={{ paddingLeft: "17px", fontSize: "13px", color: "#6e6e6e" }}>
        Inga ämnen valda ännu
      </div>
    ) : (
      <nav className={styles.nav}>
        {subjects.map(subject => {
          const color = getUniqueSubjectColor(subject.courseName);

          return (
            <div
              key={subject.courseCode}
              className={styles.iconTextButton}
              style={{
                cursor: "default",
                backgroundColor: "#f0f7fd",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  marginLeft: "4px",
                }}
              />
              <span className={styles.navText} style={{ marginLeft: "8px" }}>
                {subject.courseName}
              </span>
              {subject.grade && (
                <span
                  style={{
                    marginLeft: "auto",
                    marginRight: "10px",
                    fontWeight: 600,
                    color: "#3b3b3b",
                  }}
                >
                  {subject.grade}
                </span>
              )}
              {subject.gradeGoal && (
                <span
                  style={{
                    marginLeft: subject.grade ? "10px" : "auto",
                    marginRight: "10px",
                    fontWeight: 500,
                    color: "#1a73e8",
                  }}
                >
                  {subject.gradeGoal} 🎯
                </span>
              )}
              {subject.coursePoints != null && (
                <span
                  style={{
                    marginLeft: "10px",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: "12px",
                  }}
                >
                  {subject.coursePoints}p
                </span>
              )}
            </div>
          );
        })}
      </nav>
    );

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <IconTextButton
          icon={<UserRoundPen size={20} />}
          text="Studieprofil"
          iconClass={styles.add}
          id="edit"
          disableSelect={true}
          textColorClass={styles.addText}
          onClick={onEdit}
        />
        <IconTextButton
          icon={<GraduationCap size={20} />}
          text={userPrefs.educationLevel || "Gymnasiet"}
          iconClass={styles.educationLevelIcon}
          disableSelect={true}
        />
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
        <IconTextButton
          icon={<Calendar size={20} />}
          text={userPrefs.year?.toString() || "—"}
          iconClass={styles.yearIcon}
          disableSelect={true}
        />
      </nav>

      {/* Avklarade ämnen */}
      {hasGradedSubjects && (
        <>
          <div
            style={{
              marginTop: "10px",
              marginLeft: "7px",
              marginRight: "7px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: "#6e6e6e",
            }}
          >
            <span>Avklarade ämnen</span>
            {meritValue != null && (
              <span>Jämförelsetal: {meritValue.toFixed(2)}</span>
            )}
          </div>

          {renderSubjects(
            gradedSubjects.map(s => ({
              courseName: s.courseName,
              courseCode: s.courseCode,
              grade: s.grade ?? undefined,
              coursePoints: s.coursePoints,
            }))
          )}
        </>
      )}

      {/* Pågående ämnen */}
      {hasCurrentSubjects && (
        <>
          <div
            style={{
              marginTop: "10px",
              marginLeft: "7px",
              marginRight: "7px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: "#6e6e6e",
            }}
          >
            <span>Pågående kurser</span>
          </div>

          {renderSubjects(
            currentSubjects.map(s => ({
              courseName: s.courseName,
              courseCode: s.courseCode,
              gradeGoal: s.gradeGoal,
              coursePoints: s.coursePoints,
            }))
          )}
        </>
      )}
    </aside>
  );
}
