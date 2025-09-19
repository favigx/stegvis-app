import Login from "../../auth/components/Login";
import styles from './Landing.module.css';

export default function LandingPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.landingContainer}>
        <div className={styles.leftText}>
        
          <h1>Stegvis</h1>
          <p>Små steg varje dag leder till stora framgångar</p>
        </div>
        <div className={styles.rightLogin}>
          <Login />
        </div>
      </div>
    </div>
  );
}
