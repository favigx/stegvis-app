import type { OrientationInterface } from "./orientation";

export interface ProgramInterface {
  code: string;
  name: string;
  orientations: OrientationInterface[] | null
}