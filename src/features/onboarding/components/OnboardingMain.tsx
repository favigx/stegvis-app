import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import OnboardingSidebar from "./OnboardingSidebar";
import { Onboarding } from "./Onboarding";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import styles from "./OnboardingMain.module.css";
import type { UserPreference } from "../types/userPreferences/userPreferences";
import { useLoadPrograms } from "../hooks/useLoadPrograms";
import type { OrientationPreference } from "../types/userPreferences/orientationPreference";
import { useState, useEffect } from "react";
import OnboardingSubjects from "./OnboardingSubjects";
import OnboardingGrades from "./OnboardingGrades";
import OnboardingCurrentSubjects from "./OnboardingCurrentSubjects";
import OnboardingGradeGoal from "./OnboardingGradeGoal";

interface OnboardingMainProps {
  title?: string;
}

export function OnboardingMain({ title = "Kom igång med Stegvis" }: OnboardingMainProps) {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const { data: programs } = useLoadPrograms();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [maxStepReached, setMaxStepReached] = useState<1 | 2 | 3 | 4 | 5>(1);

  useEffect(() => {
    if (step > maxStepReached) {
      setMaxStepReached(step);
    }
  }, [step, maxStepReached]);

  const handlePrefsChange = (updatedPrefs: UserPreference) => {
    dispatch(setPreferences(updatedPrefs));
  };

  const availableOrientations: OrientationPreference[] =
    persistedPrefs.program && programs
      ? (programs
          .find(p => p.code === persistedPrefs.program?.code)
          ?.orientations.map(o => ({
            code: o.code,
            name: o.name,
            points: Number(o.points),
          })) ?? [])
      : [];

  const isYear1 = persistedPrefs.year === 1;

  const fullTabs = isYear1
    ? [
        { id: 1, label: "Introduktion och utbildning" },
        { id: 4, label: "Pågående kurser" },
        { id: 5, label: "Avslutande ord" },
      ]
    : [
        { id: 1, label: "Introduktion och utbildning" },
        { id: 2, label: "Avklarade kurser" },
        { id: 3, label: "Slutbetyg" },
        { id: 4, label: "Pågående kurser" },
        { id: 5, label: "Avslutande ord" },
      ];

  const visibleTabs = fullTabs.filter(tab => tab.id <= maxStepReached);

  return (
    <div className={styles.wrapper}>
      <OnboardingSidebar
        userPrefs={persistedPrefs}
        availableOrientations={availableOrientations}
        currentStep={step}
      />

      <div className={styles.mainContent}>
        
        <div className={styles.tabsContainer}>
          {visibleTabs.map(({ id, label }) => {
            const isActive = step === id;
            return (
              <button
                key={id}
                onClick={() => setStep(id as 1 | 2 | 3 | 4 | 5)}
                className={`${styles.tab} ${isActive ? styles.activeTab : ""}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.onboardingWrapper}>
          {step === 1 && (
            <Onboarding
              initialPrefs={persistedPrefs}
              onPrefsChange={handlePrefsChange}
              onComplete={() => {
                if (isYear1) {
                  setStep(4);
                } else {
                  setStep(2);
                }
              }}
            />
          )}

          {step === 2 && (
            <OnboardingSubjects onComplete={() => setStep(3)} />
          )}

          {step === 3 && (
            <OnboardingGrades onComplete={() => setStep(4)} />
          )}

          {step === 4 && (
            <OnboardingCurrentSubjects onComplete={() => setStep(5)} />
          )}

          {step === 5 && <OnboardingGradeGoal />}
        </div>
      </div>
    </div>
  );
}