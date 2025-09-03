import styles from './Onboarding.module.css';

interface SavingOverlayProps {
  saving: boolean;
  saved: boolean;
}

export const SavingOverlay = ({ saving, saved }: SavingOverlayProps) => {
  if (!saving) return null;

  return (
    <div className={styles.saveOverlay}>
      <div className={`${styles.saveModal} ${saved ? styles.saved : ''}`}>
        {!saved ? (
          <div className={styles.loader}></div>
        ) : (
          <div className={styles.checkmark}>
            <svg viewBox="0 0 52 52">
              <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
              <path className={styles.checkmarkCheck} fill="none" d="M14 27l7 7 16-16"/>
            </svg>
          </div>
        )}
        <p>{saved ? "Preferenser sparade" : "Sparar preferenser..."}</p>
      </div>
    </div>
  );
};