import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import styles from './OnboardingSummarize.module.css';


export function Summarize() {
  const userPrefs = useSelector((state: RootState) => state.preferences);

 return (
    <div className={styles.summarizeContainer}>
      <div className={styles.summarizeCard}>
        <h4>Nivå</h4>
        <p>{userPrefs.educationLevel || "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Program</h4>
        <p>{userPrefs.fieldOfStudy || "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Ämnen</h4>
        <p>{userPrefs.subjects?.join(", ") || "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Fokusdagar</h4>
        <p>{userPrefs.focusDays?.join(", ") || "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Dagligt mål</h4>
        <p>{userPrefs.dailyGoal || "—"}</p>
      </div>
      <div className={styles.summarizeCard}>
        <h4>Hjälp med</h4>
        <p>{userPrefs.helpRequests?.join(", ") || "—"}</p>
      </div>
    </div>
  );
}