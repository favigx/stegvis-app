import styles from './StatusOverlay.module.css';

interface StatusOverlayProps {
  active: boolean;
  completed: boolean;
  loadingText?: string;
  doneText?: string;
  icon?: React.ReactNode;
}

export const StatusOverlay = ({
  active,
  completed,
  loadingText = "Laddar...",
  doneText = "Klart!",
  icon
}: StatusOverlayProps) => {
  if (!active) return null;

  return (
    <div className={styles.statusOverlay}>
      <div className={`${styles.statusModal} ${completed ? styles.completed : ''}`}>
        {!completed ? (
          <div className={styles.loader}></div>
        ) : (
          <div className={styles.checkmark}>
            {icon ? (
              icon
            ) : (
              <svg viewBox="0 0 52 52">
                <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                <path className={styles.checkmarkCheck} fill="none" d="M14 27l7 7 16-16" />
              </svg>
            )}
          </div>
        )}
        <p>{completed ? doneText : loadingText}</p>
      </div>
    </div>
  );
};
