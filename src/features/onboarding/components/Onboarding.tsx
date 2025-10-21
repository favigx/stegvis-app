// Onboarding.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowBigRight, Eraser } from "lucide-react";

import { useLoadPrograms } from "../hooks/useLoadPrograms";
import { useLoadEnums } from "../hooks/useLoadEnums";
import { useLoadUserPreferences } from "../hooks/useLoadUserPreferences";
import { useSetUserPreference } from "../hooks/useSetUserPreference";

import OnboardingSidebar from "./OnboardingSidebar";
import { OnboardingPreferences } from "./OnboardingPreferences";
import { useSelectionHandler } from "../hooks/useSelectionHandler";
import { setHasCompletedOnboarding } from "../../../redux/slices/authSlice";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";

import type { UserPreference } from "../types/userPreferences/userPreferences";
import type { AddOnboardingPreferencesDTO } from "../types/userPreferences/addOnboardingPreferencesDTO";
import type { RootState } from "../../../redux/store";

import { StatusOverlay } from "../../../layout/StatusOverlay";
import styles from "./Onboarding.module.css";

interface OnboardingProps {
  title?: string;
  hint?: string;
  redirectPath?: string; // ⚡ Lägg till som optional
}

export function Onboarding({
  title = "Kom igång med Stegvis",
  hint,
  redirectPath,
}: OnboardingProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.profile.profile);
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const firstName = profile?.firstname ?? "";

  const { data: programs, isLoading: programsLoading, error: programsError } = useLoadPrograms();
  const { data: enums, isLoading: enumsLoading, error: enumsError } = useLoadEnums();
  const { data: userPrefData, isLoading: userPrefLoading, error: userPrefError } = useLoadUserPreferences();
  const { mutate: savePreferences } = useSetUserPreference();

  // 🔹 Lokal state som styr UI
  const [localPrefs, setLocalPrefs] = useState<UserPreference>({
    educationLevel: persistedPrefs.educationLevel || userPrefData?.userPreference?.educationLevel || "Gymnasiet",
    program: persistedPrefs.program || userPrefData?.userPreference?.program || null,
    orientation: persistedPrefs.orientation || userPrefData?.userPreference?.orientation || null,
    year: persistedPrefs.year || userPrefData?.userPreference?.year || null,
  });

  const [status, setStatus] = useState({ saving: false, saved: false });

  // 🔹 Synka initial state med API-data
  useEffect(() => {
    if (userPrefData?.userPreference) {
      setLocalPrefs(prev => ({
        educationLevel: prev.educationLevel || userPrefData.userPreference.educationLevel || "Gymnasiet",
        program: prev.program || userPrefData.userPreference.program || null,
        orientation: prev.orientation || userPrefData.userPreference.orientation || null,
        year: prev.year || userPrefData.userPreference.year || 0,
      }));
    }
  }, [userPrefData]);

  // 🔹 Uppdatera lokal state
  const updateField = (field: keyof UserPreference, value: any) => {
    setLocalPrefs(prev => ({
      ...prev,
      [field]: value,
      ...(field === "program" ? { orientation: null } : {}), // rensa orientation vid programbyte
    }));
  };

  // 🔹 Orientations baserat på valt program
  const orientations = useMemo(() => {
    if (!localPrefs.program) return [];
    const programObj = programs?.find(
      p => `${p.name} (${p.code})` === `${localPrefs.program?.name} (${localPrefs.program?.code})`
    );
    if (!programObj?.orientations) return [];

    return programObj.orientations.map(o => ({
      name: o.name,
      code: o.code,
      points: Number(o.points),
    }));
  }, [programs, localPrefs.program]);

  const handleSelect = useSelectionHandler(
    localPrefs.educationLevel,
    (val: string | string[]) => updateField("educationLevel", Array.isArray(val) ? val[0] : val),
    false
  );

  const isComplete = Boolean(
    localPrefs.educationLevel &&
    localPrefs.program &&
    localPrefs.year &&
    (orientations.length === 0 || !!localPrefs.orientation)
  );

  const handleSave = () => {
  setStatus({ saving: true, saved: false });

  // Rensa bort tunga / oönskade fält
  const cleanedProgram = localPrefs.program
    ? { code: localPrefs.program.code, name: localPrefs.program.name }
    : null;

  const cleanedOrientation = localPrefs.orientation
    ? { code: localPrefs.orientation.code, name: localPrefs.orientation.name, points: localPrefs.orientation.points }
    : null;

  const payload: AddOnboardingPreferencesDTO = {
    educationLevel: localPrefs.educationLevel,
    program: cleanedProgram,
    orientation: cleanedOrientation,
    year: localPrefs.year,
  };

  savePreferences(payload, {
    onSuccess: () => {
      // Uppdatera redux
      dispatch(setPreferences(payload));
      dispatch(setHasCompletedOnboarding(true));
      setStatus({ saving: false, saved: true });

      // 🔹 Dynamisk redirect baserat på year
      let path = "";
      if (payload.year === 1) {
        path = "/studieplaneraren/amnen-kurser";
      } else if (payload.year === 2 || payload.year === 3) {
        path = "/studieplaneraren/avklarade-amnen-kurser";
      } else {
        path = redirectPath ?? "/hem"; // fallback
      }

      // Kort delay för att visa "Sparar..." overlay
      setTimeout(() => {
        navigate(path);
        setStatus({ saving: false, saved: false });
      }, 1000);
    },
    onError: (error) => {
      console.error("Failed to save user preferences:", error);
      setStatus({ saving: false, saved: false });
    },
  });
};


  const handleReset = () => {
    setLocalPrefs({
      educationLevel: "Gymnasiet",
      program: null,
      orientation: null,
      year: null,
    });
  };

  if (userPrefLoading || programsLoading || enumsLoading) return <p>Laddar...</p>;
  if (userPrefError || programsError || enumsError)
    return <p>Ett fel inträffade: {String(userPrefError || programsError || enumsError)}</p>;

  return (
    <div className={styles.wrapper}>
      <OnboardingSidebar userPrefs={localPrefs} availableOrientations={orientations} />

      <div className={styles.content}>
        <div className={styles.onboardingContainer}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{title}</h1>
            <div
              className={`${styles.continueAction} ${!isComplete ? styles.disabled : ""}`}
              onClick={() => { if (isComplete) handleSave(); }}
            >
              <ArrowBigRight size={25} />
              {redirectPath ? "Fortsätt" : "Spara ändringar"}
            </div>
          </div>

          <p className={styles.hint}>
            {hint ?? `Hej ${firstName}! Låt oss anpassa din upplevelse.`}
          </p>

          <div style={{ width: "100%", textAlign: "left", marginTop: "12px", marginBottom: "5px" }}>
            <button type="button" className={styles.resetAction} onClick={handleReset}>
              <Eraser size={16} /> Rensa
            </button>
          </div>

          {enums && (
            <OnboardingPreferences
              localPrefs={localPrefs}
              enums={enums}
              programs={programs ?? []}
              orientations={orientations}
              updateField={updateField}
              handleSelect={handleSelect}
            />
          )}
        </div>
      </div>

      <StatusOverlay
        active={status.saving || status.saved}
        completed={status.saved}
        loadingText="Sparar preferenser..."
        doneText="Preferenser sparade!"
      />
    </div>
  );
}
