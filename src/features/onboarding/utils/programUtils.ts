import type { ProgramResponse } from "../types/skolverket/programResponse";

export function getSelectedProgram(
  programs: ProgramResponse[] | undefined,
  program: string
) {
  if (!programs || !program) return undefined;
  return programs.find((p) => `${p.name} (${p.code})` === program);
}

export function getDefaultOrientation(selectedProgram: ProgramResponse | undefined): string | null {
  if (!selectedProgram || !selectedProgram.orientations || selectedProgram.orientations.length === 0) return null;
  return selectedProgram.orientations[0].name;
}

export function getOrientationsForProgram(
  programs: ProgramResponse[] | undefined,
  program: string
): { name: string; code: string }[] {
  const selectedProgram = getSelectedProgram(programs, program);
  if (!selectedProgram?.orientations) return [];
  return selectedProgram.orientations.map(o => ({ name: o.name, code: o.code })); 
}