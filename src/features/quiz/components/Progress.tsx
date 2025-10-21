import React from "react";
import styles from "./progress.module.css";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={`${styles.progressBarContainer} ${className || ""}`}>
      <div
        className={styles.progressFill}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
