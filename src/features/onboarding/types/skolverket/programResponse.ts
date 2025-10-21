import type { ProgramInterface } from "./program";
import type { OrientationInterface } from "./orientation";

export interface ProgramResponse {
  name: string;
  code: string;
  orientations: OrientationInterface[];
  programs: ProgramInterface[];
}