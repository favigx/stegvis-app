export interface AuthState {
    id: string | null;
    user: string | null;
    token: string | null;
    expiresIn: number | null;
    isAuthenticated: boolean;
}