import React from "react";
import styles from "./UserGrades.module.css";

interface RegisterFinalGradeSummaryBoxProps {
  meritValue: number | null;
  onSave: () => void;
}

export default function RegisterFinalGradeSummaryBox({ meritValue }: RegisterFinalGradeSummaryBoxProps) {
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryBox}>
        <span className={styles.summaryTitle}>Jämförelsetal</span>
        <div className={styles.meritCircle}>
          {meritValue != null ? meritValue.toFixed(2) : "--"}
        </div>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.info}>
          De betyg med blå ring runt sig är dina betygsmål.
        </div>
      </div>
    </div>
  );
}
