import styles from "./EditStudyProfileSidebar.module.css";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";

interface Props {
  subjects: SubjectPreference[];
}

export default function OnboardingSidebarCurrentSubjectsSummary({ subjects }: Props) {
  if (!subjects || subjects.length === 0)
    return (
      <div className={styles.summaryBox}>
        <p className={styles.summaryTitle}>Valda kurser</p>
        <p className={styles.summaryEmpty}>Inga kurser valda ännu</p>
      </div>
    );

  return (
    <div className={styles.summaryBox}>
      <p className={styles.summaryTitle}>Valda kurser</p>

      <ul className={styles.summaryList}>
        {subjects.map((s) => (
          <li key={s.courseCode} className={styles.summaryItem}>
            <span className={styles.summaryName}>{s.courseName}</span>
            <span className={styles.summaryCode}>{s.courseCode}</span>
            <span className={styles.summaryPoints}>{s.coursePoints}p</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
