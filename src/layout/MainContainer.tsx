import AppRoutes from "../routes/AppRoutes";
import styles from "./MainContainer.module.css";

interface MainContainerProps {
  collapsed: boolean; // tar emot collapsed som prop
}

function MainContainer({ collapsed }: MainContainerProps) {
  return (
    <div
      className={styles.mainContainer}
      style={{ left: collapsed ? '60px' : '220px' }} 
    >
      <AppRoutes />
    </div>
  );
}

export default MainContainer;
