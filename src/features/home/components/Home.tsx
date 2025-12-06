import { useSelector } from "react-redux";
import { TodoBoard } from "../../todo/components/TodoBoard";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import type { RootState } from "../../../redux/store";

export function Home() {
   const profile = useSelector((state: RootState) => state.profile.profile);
  const firstName = profile?.firstname ?? "";
  return (
    <div className={styles.homeContainer}>
      <h2 className={styles.h2}>Hej {firstName}, vad vill du göra idag?</h2>
      
      {/* Tre stora färgade boxar högst upp */}
      <div className={styles.topBoxes}>
        <Link to="/studieplaneraren/oversikt" className={`${styles.BoardContainer} ${styles.redBox} ${styles.clickableBox}`}>
          <div className={styles.section}>
            <h2 className={styles.sectionHeader}>Planera</h2>
            <p className={styles.pnotes}>
              Håll ordning på dina uppgifter och aktiviteter.<br /><br />
              Lägg in uppgifter i kalendern, schemalägg deadlines och påminnelser.<br /><br />
              Få överblick över din tid, prioritera smart och nå dina mål enklare.
            </p>
          </div>
        </Link>

        <Link to="/anteckningar" className={`${styles.BoardContainer} ${styles.greenBox} ${styles.clickableBox}`}>
          <div className={styles.section}>
            <h2 className={styles.sectionHeader}>Anteckna</h2>
            <p className={styles.pnotes}>
              Samla alla dina lektionsanteckningar på ett och samma ställe. Skriv, redigera och strukturera dina anteckningar på ett enkelt sätt. 
              <br/><br/>Med AI kan du optimera dina anteckningar, 
              skapa quiz och flashcards direkt från innehållet.
            </p>
          </div>
        </Link>

        <Link to="/quiz" className={`${styles.BoardContainer} ${styles.blueBox} ${styles.clickableBox}`}>
          <div className={styles.section}>
            <h2 className={styles.sectionHeader}>Quiz och flashcards</h2>
            <p className={styles.pnotes}>
              Förvandla dina anteckningar till roliga och effektiva quiz och flashcards.<br /><br />
              Testa dina kunskaper, repetera smart och lär dig snabbare med AI-assisterade verktyg.<br /><br />
              Perfekt för inlärning och repetition på ett interaktivt sätt.
            </p>
          </div>
        </Link>
      </div>

      {/* TodoBoard under de tre boxarna, längst till vänster */}
      <div className={styles.todoBoardWrapper}>
        <TodoBoard />
      </div>
    </div>
  );
}
