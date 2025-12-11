import { BookOpen } from "lucide-react";
import styles from "./CourseSidebar.module.css";
import type { AvailableCourses } from "../../types/courses";

// TEMP: Hardcoded grouped courses (in the future: fetched from API)
const courseGroups: Record<string, Array<AvailableCourses>> = {
  "1": ["AI"],
};

interface MiniCourseSidebarProps {
  onSelectCourse?: (course: AvailableCourses, level: string) => void;
}

export default function MiniCourseSidebar({
  onSelectCourse,
}: MiniCourseSidebarProps) {
  const IconTextButton = ({
    text,
    level,
    course,
    nested = false,
  }: {
    text: string;
    level: string;
    course: AvailableCourses;
    nested?: boolean;
  }) => (
    <button
      className={`${styles.iconTextButton} ${nested ? styles.nested : ""} $/* {
        selected === {course: level} ? styles.selected : ""
      } */`}
      onClick={() => {
        onSelectCourse?.(course, level);
      }}
    >
      <span className={styles.navText}>{text}</span>
    </button>
  );

  const groupsWithCourses = Object.entries(courseGroups).filter(
    ([_, list]) => list.length > 0
  );

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {groupsWithCourses.map(([level, courses]) => (
          <div key={level} className={styles.folder}>
            <div className={styles.folderHeader}>
              <span className={styles.navText}>Nivå {level}</span>
            </div>

            {
              <div className={styles.folderContent}>
                {courses.map((course) => (
                  <div key={course} className={styles.subFolder}>
                    <div className={styles.subFolderHeader}>
                      <BookOpen size={16} className={styles.courseIcon} />
                      {course}
                    </div>

                    <IconTextButton
                      text="Gå till kurs"
                      course={course}
                      level={level}
                      nested
                    />
                  </div>
                ))}
              </div>
            }
          </div>
        ))}
      </nav>
    </aside>
  );
}
