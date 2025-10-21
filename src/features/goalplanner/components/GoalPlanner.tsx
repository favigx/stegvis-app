// GoalPlanner.tsx
import React from "react";
import styles from "./GoalPlanner.module.css";
import GoalPlannerSidebar from "./GoalPlannerSidebar";

function GoalPlanner() {
  return (
    <div className={styles.plannerWrapper}>
      {/* Layout med sidebar + main content */}
      <div className={styles.contentWrapper}>
        <GoalPlannerSidebar />
        <div className={styles.plannerListContainer}>
          <div className={styles.plannerContentWrapper}>
            <h1>Målplaneraren</h1>
            {/* Här kan du lägga goal editor och goal list */}
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalPlanner;
