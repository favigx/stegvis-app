import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { setPreferences } from "../../redux/slices/userPreferenceSlice";
import { EnumButtons } from "./EnumButtons";
import { LoadEnums } from "./Enums";
import type { UserPreference } from "../../interfaces/user/preferences";
import { setUserPreferences } from "../../api/user/preferences";
import { Summarize } from "./OnboardingSummarize";
import styles from './Onboarding.module.css'


export function Onboarding() {
  const dispatch = useDispatch();
  const enums = useSelector((state: RootState) => state.enums);
  const userPrefs = useSelector((state: RootState) => state.preferences);

  const updateField = (field: keyof UserPreference, value: any) => {
    dispatch(setPreferences({ [field]: value }));
  };

  const handleSave = async () => {
    try {
      console.log("Saving preferences:", userPrefs);
      const response = await setUserPreferences(userPrefs);
      console.log("Preferences saved successfully:", response);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
  };

  if (!enums) return <p>Laddar enums...</p>;

  return (
  <>
  <div className={styles.onboardingWrapper}>
    <div className={styles.onboardingContainer}>
      <h3>Onboarding</h3>
      <LoadEnums />
      <EnumButtons
        title="Skolnivå"
        options={enums.educationLevels}
        selected={userPrefs.educationLevel}
        onSelect={(val) => updateField("educationLevel", val)}
      />
      <EnumButtons
        title="Program"
        options={enums.fieldOfStudies}
        selected={userPrefs.fieldOfStudy}
        onSelect={(val) => updateField("fieldOfStudy", val)}
      />
      <EnumButtons
        title="Ämnen"
        options={enums.subjects}
        selected={userPrefs.subjects}
        onSelect={(val) => updateField("subjects", val)}
        multiple
      />
      <EnumButtons
        title="Fokusdagar"
        options={enums.focusDays}
        selected={userPrefs.focusDays}
        onSelect={(val) => updateField("focusDays", val)}
        multiple
      />
      <EnumButtons
        title="Dagligt mål"
        options={enums.dailyGoals.map(String)}
        selected={userPrefs.dailyGoal?.toString() || null}
        onSelect={(val) => updateField("dailyGoal", Number(val))}
      />
      <EnumButtons
        title="Vad vill du ha hjälp med?"
        options={enums.helpRequests}
        selected={userPrefs.helpRequests}
        onSelect={(val) => updateField("helpRequests", val)}
        multiple
      />
      <button className={styles.savePrefBtn} onClick={handleSave}>Fortsätt</button>
    </div>

    <div className={styles.summarizeContainer}>
      <Summarize />
    </div>
  </div>
</>

  );
}
