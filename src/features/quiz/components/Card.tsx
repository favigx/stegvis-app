import React, { type ReactNode } from "react";
import styles from "./card.module.css";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className={styles.cardHeader}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`${styles.cardTitle} ${className}`}>{children}</h2>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className={styles.cardContent}>{children}</div>;
}
