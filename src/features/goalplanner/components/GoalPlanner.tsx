import styles from "./GoalPlanner.module.css";
import GoalPlannerSidebar from "./GoalPlannerSidebar";

function GoalPlanner() {
  return (
    <div className={styles.plannerWrapper}>
      <div className={styles.contentWrapper}>
        <GoalPlannerSidebar />
        <div className={styles.plannerListContainer}>
          <div className={styles.plannerContentWrapper}>
            <h1>Målplaneraren</h1>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalPlanner;
