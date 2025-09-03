import type { SubjectContainerInterface } from "./subjectcontainer";
import type { OrientationInterface } from "./orientation";

export interface ProgramDetailsInterface {
    code: string;
    name: string;
    foundationSubjects: SubjectContainerInterface;
    programmeSpecificSubjects: SubjectContainerInterface;
    specialization: SubjectContainerInterface;
    orientations: OrientationInterface[];
}