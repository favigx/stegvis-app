import AppRoutes from "../routes/AppRoutes";
import styles from "./MainContainer.module.css";



function MainContainer() {
  return (
    <div className={styles.mainContainer}>
      <AppRoutes />
    </div>
  );
}

export default MainContainer;
