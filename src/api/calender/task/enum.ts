import type { TypeEnum } from "../../../interfaces/calender/task/enum/type"; 
import { apiFetch } from "../../apiClient"; 

export async function getCalenderTypeEnum(): Promise<TypeEnum> {
    const data = await apiFetch('/calender/task/enum', { method: 'GET' });
    return data as TypeEnum;
}