import type { RegisterDTO } from "../../interfaces/user/dto/register";
import type { UserRegisterResponse } from "../../interfaces/user/dto/registerResponse";
import { apiFetch } from "../apiClient";

export async function registerUser(registerDto: RegisterDTO): Promise<UserRegisterResponse> {
    return apiFetch("/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerDto),
    }) as Promise<UserRegisterResponse>;
}