import type { LoginDTO } from "../../interfaces/user/dto/login";
import type { UserLoginResponse } from "../../interfaces/user/dto/loginResponse";
import { apiFetch } from "../apiClient";

export async function loginUser(loginDto: LoginDTO): Promise<UserLoginResponse> {
    return apiFetch("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDto),
    }) as Promise<UserLoginResponse>;
}