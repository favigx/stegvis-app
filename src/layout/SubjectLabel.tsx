import styles from "./SubjectLabel.module.css";
import { getUniqueSubjectColor } from "../features/notes/utils/getSubjectColor"; // flytta din funktion hit

interface SubjectLabelProps {
  subject: string;
}

export function SubjectLabel({ subject }: SubjectLabelProps) {
  return (
    <div className={styles.subjectBanner}>
      <span
        className={styles.subjectCircle}
        style={{ backgroundColor: getUniqueSubjectColor(subject) }}
      />
      {subject}
    </div>
  );
}
