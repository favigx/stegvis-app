import MiniCourseSidebar from "./components/courseSidebar/CourseSidebar";
import { useState } from "react";
import type { AvailableCourses } from "./types/courses";
import SelectedCourse from "./components/SelectedCourse";
import styles from "./Courses.module.css";

export interface ChosenCourse {
  level: string;
  course: AvailableCourses;
}

function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<ChosenCourse>(
    {} as ChosenCourse
  );

  const handleSelectCourse = (course: AvailableCourses, level: string) => {
    setSelectedCourse({ level, course });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebarWrapper}>
        <MiniCourseSidebar onSelectCourse={handleSelectCourse} />
      </div>
      {selectedCourse.course && selectedCourse.level && (
        <div className={styles.content}>
          <SelectedCourse selectedCourse={selectedCourse} />
        </div>
      )}
    </div>
  );
}

export default Courses;
