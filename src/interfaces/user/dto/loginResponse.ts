export interface UserLoginResponse {
    id: string;
    email: string;
    token: string;
    tokenType: string;
    expiresIn: number;
}