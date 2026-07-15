import { useQueryClient } from "@tanstack/react-query";
import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
    type ReactNode,
} from "react";

import {
    currentUserQueryOptions,
    useCurrentUserQuery,
} from "@/features/auth/api";
import {
    AuthContext,
    type AuthContextValue,
    type AuthSessionNotice,
    type AuthStatus,
} from "@/features/auth/context/AuthContext";
import type {
    AuthResponse,
    CurrentUser,
} from "@/features/auth/model";
import { subscribeAuthSessionExpired } from "@/features/auth/session/authSessionEvents";
import { authStorage } from "@/lib/auth/authStorage";
import {
    ApiError,
    toApiError,
} from "@/lib/errors/ApiError";

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    const queryClient = useQueryClient();

    const [, refreshSessionState] =
        useReducer(
            (revision: number) =>
                revision + 1,
            0,
        );

    const [
        sessionNotice,
        setSessionNotice,
    ] = useState<AuthSessionNotice>(null);

    const hasAccessToken =
        authStorage.getAccessToken() !== null;

    const currentUserQuery =
        useCurrentUserQuery(hasAccessToken);

    const user =
        currentUserQuery.data ?? null;

    const expireSession =
        useCallback(() => {
            authStorage.clearAccessToken();

            queryClient.clear();

            setSessionNotice("expired");

            refreshSessionState();
        }, [queryClient]);

    useEffect(() => {
        return subscribeAuthSessionExpired(
            expireSession,
        );
    }, [expireSession]);

    useEffect(() => {
        if (
            !hasAccessToken ||
            !currentUserQuery.isError
        ) {
            return;
        }

        const apiError = toApiError(
            currentUserQuery.error,
        );

        if (apiError.status !== 401) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            expireSession();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        currentUserQuery.error,
        currentUserQuery.isError,
        expireSession,
        hasAccessToken,
    ]);

    let status: AuthStatus =
        "unauthenticated";

    let authError: ApiError | null = null;

    if (hasAccessToken) {
        if (currentUserQuery.isPending) {
            status = "checking";
        } else if (
            currentUserQuery.isError
        ) {
            status = "error";

            authError = toApiError(
                currentUserQuery.error,
            );
        } else if (
            user?.status === "DISABLED"
        ) {
            status = "disabled";

            authError = new ApiError({
                status: 403,
                code: "ACCOUNT_DISABLED",
                message:
                    "This account has been disabled. Contact support if you believe this is a mistake.",
                retryable: false,
            });
        } else if (user) {
            status = "authenticated";
        } else {
            status = "error";

            authError = new ApiError({
                status: null,
                code: "AUTH_STATE_INVALID",
                message:
                    "The authentication state could not be determined.",
                retryable: true,
            });
        }
    }

    const establishSession =
        useCallback(
            async (
                authResponse: AuthResponse,
                rememberSession: boolean,
            ): Promise<CurrentUser> => {
                queryClient.clear();

                setSessionNotice(null);

                authStorage.setAccessToken(
                    authResponse.token,
                    rememberSession,
                );

                refreshSessionState();

                try {
                    return await queryClient.fetchQuery({
                        ...currentUserQueryOptions(),
                        staleTime: 0,
                    });
                } catch (error) {
                    const apiError =
                        toApiError(error);

                    if (apiError.status === 401) {
                        authStorage.clearAccessToken();

                        queryClient.clear();

                        refreshSessionState();
                    }

                    throw apiError;
                }
            },
            [queryClient],
        );

    const refreshCurrentUser =
        useCallback(
            async (): Promise<CurrentUser> => {
                if (
                    !authStorage.getAccessToken()
                ) {
                    throw new ApiError({
                        status: 401,
                        code: "UNAUTHENTICATED",
                        message:
                            "There is no active authentication session.",
                        retryable: false,
                    });
                }

                return queryClient.fetchQuery({
                    ...currentUserQueryOptions(),
                    staleTime: 0,
                });
            },
            [queryClient],
        );

    const clearSessionNotice =
        useCallback(() => {
            setSessionNotice(null);
        }, []);

    const signOut = useCallback(
        async (): Promise<void> => {
            authStorage.clearAccessToken();

            queryClient.clear();

            setSessionNotice(null);

            refreshSessionState();
        },
        [queryClient],
    );

    const contextValue =
        useMemo<AuthContextValue>(
            () => ({
                user,
                status,
                isAuthenticated:
                    status === "authenticated",
                error: authError,
                sessionNotice,
                establishSession,
                refreshCurrentUser,
                clearSessionNotice,
                signOut,
            }),
            [
                authError,
                clearSessionNotice,
                establishSession,
                refreshCurrentUser,
                sessionNotice,
                signOut,
                status,
                user,
            ],
        );

    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
}