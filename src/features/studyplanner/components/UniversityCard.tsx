import { FcOk } from "react-icons/fc";
import styles from "./UniversityCard.module.css";
import type { EligibleProgramResponse } from "../types/EligibleProgramResponse";

interface UniversityCardProps {
  program: EligibleProgramResponse;
  onReadMore?: (program: EligibleProgramResponse) => void;
}

export function UniversityCard({ program }: UniversityCardProps) {
  return (
    <div className={styles.card}>
      <FcOk className={styles.approvalIcon} size={29} />

      <div className={styles.header}>
        <h3 className={styles.programName}>{program.programnamn}</h3>
        <span className={styles.university}>
          {program.universitet} • {program.ort}
        </span>
      </div>

      {program.antagningUrl && (
        <a
          href={program.antagningUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.readMoreButton}
        >
          Läs mer på Antagning.se
        </a>
      )}
    </div>
  );
}
