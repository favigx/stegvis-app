import type { UserPreference } from "../types/userPreferences/userPreferences";
import styles from './OnboardingSummarize.module.css';
import styless from '../../../layout/Container.module.css'

interface SummarizeProps {
  userPrefs: UserPreference;
}

export function Summarize({ userPrefs }: SummarizeProps) {
  return (
    <div className={styless.mainContainer2} style={{ paddingBottom: '2rem' }}>
      <dl className={styles.summarizeList}>
        <div className={styles.summarizeItem}>
          <dt>Skolnivå</dt>
          <dd>{userPrefs.educationLevel || "—"}</dd>
        </div>
        <div className={styles.summarizeItem}>
          <dt>Program</dt>
          <dd>{userPrefs.fieldOfStudy || "—"}</dd>
        </div>
        <div className={styles.summarizeItem}>
          <dt>Inriktning</dt>
          <dd>{userPrefs.orientation || "—"}</dd>
        </div>
        <div className={styles.summarizeItem}>
          <dt>År</dt>
          <dd>{userPrefs.year || "—"}</dd>
        </div>
        <div className={styles.summarizeItem}>
          <dt>Ämnen</dt>
          <dd>{userPrefs.subjects?.length ? userPrefs.subjects.join(", ") : "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
