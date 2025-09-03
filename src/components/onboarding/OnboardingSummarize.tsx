import type { UserPreference } from "../../interfaces/user/preferences";
import styles from './OnboardingSummarize.module.css';

interface SummarizeProps {
  userPrefs: UserPreference;
}

export function Summarize({ userPrefs }: SummarizeProps) {
  return (
    <div className={styles.summarizeContainer}>
      <div className={styles.summarizeCard}>
        <h4>Skolnivå</h4>
        <p>{userPrefs.educationLevel || "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>År</h4>
        <p>{userPrefs.year || "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Program</h4>
        <p>{userPrefs.fieldOfStudy || "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Ämnen</h4>
        <p>{userPrefs.subjects?.length ? userPrefs.subjects.join(", ") : "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Fokusdagar</h4>
        <p>{userPrefs.focusDays?.length ? userPrefs.focusDays.join(", ") : "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Dagligt mål</h4>
        <p>{userPrefs.dailyGoal != null ? `${userPrefs.dailyGoal} minuter` : "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Hjälp med</h4>
        <p>{userPrefs.helpRequests?.length ? userPrefs.helpRequests.join(", ") : "—"}</p>
      </div>
    </div>
  );
}