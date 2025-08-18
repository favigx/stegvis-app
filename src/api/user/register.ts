import type { RegisterDTO } from "../../interfaces/user/dto/register";
import type { UserRegisterResponse } from "../../interfaces/user/dto/registerResponse";
import { apiClient } from "../apiClient";

export async function registerUser(registerDto: RegisterDTO): Promise<UserRegisterResponse> {
  try {
    const response = await apiClient.post<UserRegisterResponse>("/auth/register", registerDto);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Något gick fel vid registrering");
    }
    throw new Error("Kunde inte nå servern");
  }
}