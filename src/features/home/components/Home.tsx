import { TodoBoard } from "../../todo/components/TodoBoard";
import styles from "./Home.module.css";

export function Home() {
  return (
    <div className={styles.homeContainer}>

      <div className={styles.BoardContainer}>
        <div className={styles.section}>
          <h2 className={styles.sectionHeader}>Att göra</h2>
          <p className={styles.pinfo}>Skapa uppgifter och dra sedan aktuella uppgifter till "Pågående" och "Klart"</p>
          <TodoBoard />
        </div>
      </div>

      <div className={styles.BoardContainer}>
        <div className={styles.section}>
          <h2 className={styles.sectionHeader}>Fönster nummer 2</h2>

        </div>
      </div>
    </div>
  );
}
