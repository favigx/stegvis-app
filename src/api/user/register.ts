import type { RegisterDTO } from "../../interfaces/user/dto/register";
import type { UserRegisterResponse } from "../../interfaces/user/dto/registerResponse";
import { apiFetch } from "../apiClient";

export async function registerUser(registerDto: RegisterDTO): Promise<UserRegisterResponse> {
    const data = await apiFetch("/user/register", {
        method: "POST",
        body: JSON.stringify(registerDto),
    });

    return data as UserRegisterResponse;
}