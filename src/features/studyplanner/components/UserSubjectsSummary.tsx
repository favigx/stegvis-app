import { getUniqueSubjectColor } from "../../notes/utils/getSubjectColor";
import styles from "./UserSubjects.module.css";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";

interface SummaryProps {
  selectedSubjects: SubjectPreference[];
}

export function UserSubjectsSummary({ selectedSubjects }: SummaryProps) {
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryBox}>
        <span className={styles.summaryTitle}>Valda ämnen</span>

        {selectedSubjects.length === 0 ? (
          <p className={styles.infoTextSummary}>Inga ämnen valda ännu.</p>
        ) : (
          <div className={styles.subjectList}>
            {selectedSubjects.map((subj) => {
              const color = getUniqueSubjectColor(subj.courseName);
              return (
                <div key={subj.courseCode} className={styles.subjectBanner}>
                  <div
                    className={styles.subjectCircle}
                    style={{ backgroundColor: color }}
                  />
                  <span>{subj.courseName}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSubjectsSummary;
