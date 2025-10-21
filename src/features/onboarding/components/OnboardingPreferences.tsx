// OnboardingPreferences.tsx
import { useState, useMemo } from "react";
import { PreferenceSection } from "./PreferenceSection";
import type { UserPreference } from "../types/userPreferences/userPreferences";
import type { ProgramPreference } from "../types/userPreferences/programPreference";
import type { OrientationPreference } from "../types/userPreferences/orientationPreference";

interface OnboardingPreferencesProps {
  localPrefs: UserPreference;
  enums: any;
  programs: ProgramPreference[];
  orientations: OrientationPreference[];
  updateField: (field: keyof UserPreference, value: any) => void;
  handleSelect: (val: string | string[]) => void;
}

export function OnboardingPreferences({
  localPrefs,
  enums,
  programs,
  orientations,
  updateField,
  handleSelect
}: OnboardingPreferencesProps) {
  const [programSearch, setProgramSearch] = useState("");

  const filteredPrograms = useMemo(() => {
    if (!programSearch) {
      if (!localPrefs.program) return [];
      return programs.filter(p => p.code === localPrefs.program?.code);
    }

    return programs.filter(
      p =>
        p.name.toLowerCase().includes(programSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(programSearch.toLowerCase())
    );
  }, [programs, programSearch, localPrefs.program?.code]);

  return (
    <>
      {/* Skolnivå */}
      <PreferenceSection
        title="Skolnivå"
        options={enums.educationLevels.map((e: string) => ({ name: e, code: e }))}
        selected={localPrefs.educationLevel}
        onSelect={handleSelect}
      />

      {/* Program */}
      {programs.length > 0 && (
        <PreferenceSection
          title="Program"
          options={filteredPrograms.map(p => ({ name: `${p.name} (${p.code})`, code: p.code }))}
          selected={localPrefs.program?.code ?? null}
          searchable
          searchValue={programSearch}
          onSearchChange={setProgramSearch}
          onSelect={(code) => {
            const selectedProgram = programs.find(p => p.code === code);
            updateField("program", selectedProgram ?? null);
          }}
        />
      )}

      {/* Inriktning */}
      {orientations.length > 0 && (
       <PreferenceSection
  title="Inriktning"
  options={orientations.map(o => ({ name: o.name, code: o.code }))}
  selected={localPrefs.orientation?.code ?? null}
  onSelect={(code) => {
    const selectedOrientation = orientations.find(o => o.code === code);
    updateField("orientation", selectedOrientation ?? null); // ✅ här sparas bara vald
  }}
/>

      )}

      {/* År */}
      <PreferenceSection
        title="År"
        options={enums.year.map((y: any, i: number) => ({ name: `${i + 1}`, code: `${i + 1}` }))}
        selected={localPrefs.year ? `${localPrefs.year}` : null}
        onSelect={(val) =>
          updateField("year", typeof val === "string" ? Number(val) : Number(val[0]))
        }
      />

      

      
    </>
  );
}
