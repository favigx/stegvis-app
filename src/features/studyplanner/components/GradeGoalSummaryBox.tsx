import React from "react";
import styles from "./UserGrades.module.css";

interface GradeGoalSummaryBoxProps {
  meritValue: number | null;
  onSave: () => void;
}

export default function GradeGoalSummaryBox({ meritValue }: GradeGoalSummaryBoxProps) {
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryBox}>
        <span className={styles.summaryTitle}>Jämförelsetal baserat på mål</span>
        <div className={styles.meritCircle}>
          {meritValue != null ? meritValue.toFixed(2) : "--"}
        </div>
      </div>

     
    </div>
  );
}
