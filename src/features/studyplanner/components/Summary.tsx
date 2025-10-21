import React from "react";
import styles from "./UserGrades.module.css";

interface SummaryProps {
  meritValue: number | null;
  onSave: () => Promise<boolean>;
}

export default function SummaryBox({ meritValue }: SummaryProps) {
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
          Glöm inte bort att du kan ha meritpoäng också! Dem lägger du till själv.<br /><br />
          Jämförelsetal + meritpoäng = meritvärde.<br /><br />
          Ditt sammanlagda meritvärde kan bli högst 22,5.
        </div>
      </div>
    </div>
  );
}
