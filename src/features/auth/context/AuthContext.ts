import { createContext } from "react";

import type {
    AuthResponse,
    CurrentUser,
} from "@/features/auth/model";
import type { ApiError } from "@/lib/errors/ApiError";

export type AuthStatus =
    | "checking"
    | "authenticated"
    | "unauthenticated"
    | "disabled"
    | "error";

export type AuthSessionNotice =
    | "expired"
    | null;

export type AuthContextValue = {
    user: CurrentUser | null;

    status: AuthStatus;

    isAuthenticated: boolean;

    error: ApiError | null;

    sessionNotice: AuthSessionNotice;

    establishSession: (
        authResponse: AuthResponse,
        rememberSession: boolean,
    ) => Promise<CurrentUser>;

    refreshCurrentUser: () =>
        Promise<CurrentUser>;

    clearSessionNotice: () => void;

    signOut: () => Promise<void>;
};

export const AuthContext =
    createContext<AuthContextValue | null>(
        null,
    );