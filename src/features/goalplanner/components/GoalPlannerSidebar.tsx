// GoalPlannerSidebar.tsx
import styles from "./GoalPlannerSidebar.module.css";

function GoalPlannerSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <h2 className={styles.header}>Målplaneraren</h2>
        <p className={styles.text}>
          Målplaneraren hjälper dig att planera din framtid genom att utgå från
          dina skolbetyg. Här kan du enkelt lägga in dina ämnesbetyg och få ditt
          aktuella meritvärde beräknat automatiskt.
        </p>
        <p className={styles.text}>
          Baserat på ditt meritvärde kan du sedan utforska vilka utbildningar
          du är behörig till. Du kan själv ange ett område du är intresserad av,
          till exempel <em>juridik</em>, och direkt få en lista över relevanta
          utbildningar där dina meriter räcker till.
        </p>
        <p className={styles.text}>
          På så sätt blir målplaneraren ett stöd för att förstå dina möjligheter
          och ta nästa steg mot din framtida utbildning.
        </p>
      </div>
    </aside>
  );
}

export default GoalPlannerSidebar;
