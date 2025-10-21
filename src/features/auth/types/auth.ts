export interface AuthState {
    id: string | null;
    user: string | null;
    isAuthenticated: boolean;
    hasCompletedOnboarding: boolean | null;
} 