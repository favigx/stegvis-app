import type { LoginDTO } from "../../interfaces/user/dto/login";
import type { UserLoginResponse } from "../../interfaces/user/dto/loginResponse";
import { apiFetch } from "../apiClient";

export async function loginUser(loginDto: LoginDTO): Promise<UserLoginResponse> {
    const data = await apiFetch("/user/login", {
        method: "POST",
        body: JSON.stringify(loginDto),
    });

    return data as UserLoginResponse;
}

export async function logoutUser(): Promise<void> {
    await apiFetch("/user/logout", {
        method: "POST",
    });
}