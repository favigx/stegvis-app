import type { TypeEnum } from "../../../interfaces/calender/task/enum/type"; 
import { apiFetch } from "../../apiClient"; 

export async function getCalenderTypeEnum(): Promise<TypeEnum> {
    return apiFetch('/calender/task/enum', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }) as Promise<TypeEnum>
}