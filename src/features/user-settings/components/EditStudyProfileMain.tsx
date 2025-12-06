import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useLoadPrograms } from "../../onboarding/hooks/useLoadPrograms";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";

import EditStudyProifleSidebar from "./EditStudyProfileSidebar";
import { EditStudyProfile } from "./EditStudyProfile";
import EditStudyProfileSubjects from "./EditStudyProfileSubjects";
import EditStudyProfileGrades from "./EditStudyProfileGrades";
import EditStudyProfileCurrentSubjects from "./EditStudyProfileCurrentSubjects";
import EditStudyProfileGradeGoal from "./EditStudyProfileGradeGoal";

import type { UserPreference } from "../../onboarding/types/userPreferences/userPreferences";
import type { OrientationPreference } from "../../onboarding/types/userPreferences/orientationPreference";

import styles from "./EditStudyProfileMain.module.css";

interface EditStudyProfileMainProps {
  title?: string;
}

export function EditStudyProfileMain({
  title = "Redigera studieprofil",
}: EditStudyProfileMainProps) {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const { data: programs } = useLoadPrograms();

  // Uppdatera preferenser
  const handlePrefsChange = (updatedPrefs: UserPreference) => {
    dispatch(setPreferences(updatedPrefs));
  };

  // Ladda orienteringar för valt program
  const availableOrientations: OrientationPreference[] =
    persistedPrefs.program && programs
      ? (programs
          .find((p) => p.code === persistedPrefs.program?.code)
          ?.orientations.map((o) => ({
            code: o.code,
            name: o.name,
            points: Number(o.points),
          })) ?? [])
      : [];

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <EditStudyProifleSidebar
        userPrefs={persistedPrefs}
        availableOrientations={availableOrientations}
      />

      {/* Main content – alla komponenter under varandra */}
      <div className={styles.mainContent}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.onboardingWrapper}>
          <EditStudyProfile
            initialPrefs={persistedPrefs}
            onPrefsChange={handlePrefsChange}
          />

          <EditStudyProfileSubjects />

          <EditStudyProfileGrades />

          <EditStudyProfileCurrentSubjects />

          <EditStudyProfileGradeGoal />
        </div>
      </div>
    </div>
  );
}
