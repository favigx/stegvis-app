import React from "react";
import { getUniqueSubjectColor } from "../../notes/utils/getSubjectColor"; 
import styles from "./UserSubjects.module.css";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";

interface SummaryProps {
  selectedSubjects: GradedSubject[];
}

export function UserFinishedSubjectsSummarize({ selectedSubjects }: SummaryProps) {
  if (selectedSubjects.length === 0) {
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.summaryBox}>
          <span className={styles.summaryTitle}>Avklarade ämnen</span>
          <p className={styles.infoTextSummary}>Inga ämnen valda ännu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryBox}>
        <span className={styles.summaryTitle}>Avklarade ämnen</span>

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
      </div>
    </div>
  );
}

export default UserFinishedSubjectsSummarize;
