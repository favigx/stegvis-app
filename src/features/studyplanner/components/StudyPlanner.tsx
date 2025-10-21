import { useLocation, useNavigate } from "react-router-dom";
import StudyPlannerSidebar from "./StudyPlannerSidebar";
import FirstPage from "./FirstPage";
import { UserSubjects } from "./UserSubjects";
import UserGrades from "./UserGrades";
import GradeGoal from "./GradeGoal";
import UniversityPrograms from "./UniversityPrograms";
import RegisterFinalGrade from "./RegisterFinalGrade";
import UserFinishedSubjects from "./UserFinishedSubjects";
import styles from './StudyPlanner.module.css';

function StudyPlanner() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Läs category direkt från URL-path
  const selectedCategory = location.pathname.split("/").pop() || "oversikt";

  const handleSelectCategory = (cat: string) => {
    if (cat !== selectedCategory) {
      navigate(`/studieplaneraren/${cat}`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebarWrapper}>
        <StudyPlannerSidebar 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleSelectCategory} 
        />
      </div>

      <div className={styles.content}>
        {selectedCategory === "oversikt" && <FirstPage />}
        {selectedCategory === "kalender" && <h2>Kalender</h2>}
        {selectedCategory === "mal" && <GradeGoal />}
        {selectedCategory === "studier" && <h2>Studier</h2>}
        {selectedCategory === "amnen-kurser" && <UserSubjects />}
        {selectedCategory === "betyg-meritvarde" && <UserGrades />}
        {selectedCategory === "universitetsprogram" && <UniversityPrograms />}
        {selectedCategory === "slutbetyg" && <RegisterFinalGrade />}
        {selectedCategory === "avklarade-amnen-kurser" && <UserFinishedSubjects />}
      </div>
    </div>
  );
}

export default StudyPlanner;
