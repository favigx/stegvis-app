import type { SubjectInterface } from "./subject";

export interface OrientationInterface {
  code: string;
  name: string;
  points: string;
  subjects: SubjectInterface[]
}