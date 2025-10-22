import styles from "./UserGrades.module.css";

interface SummaryProps {
  meritValue: number | null;
  onSave: () => void;
}

export function GradeGoalSummary({ meritValue, onSave }: SummaryProps) {
  return (
    <div className={styles.summaryContainer}>
      
      <div className={styles.summaryBox}>
        
        <span className={styles.summaryTitle}>Jämförelsetal baserat på mål</span>
        <div className={styles.meritCircle}>
          {meritValue != null ? meritValue.toFixed(2) : "--"}
        </div>
      </div>
      

      <button onClick={onSave} className={styles.gradeButton}>
        Spara mål
      </button>
        <div className={styles.info}>
            De betyg med blå ring runt sig är dina nuvarande betyg.
        </div>
    </div>
  );
}

export default GradeGoalSummary;
