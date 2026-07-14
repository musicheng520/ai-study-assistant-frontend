import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router";

import { SessionStateScreen } from "@/features/auth/components/SessionStateScreen";
import { useAuth } from "@/features/auth/context";
import { createAuthRedirectState } from "@/features/auth/routing/authRedirect";

export function ProtectedRoute() {
    const location = useLocation();

    const {
        status,
        isAuthenticated,
        error,
        sessionNotice,
        refreshCurrentUser,
        signOut,
    } = useAuth();

    if (status === "checking") {
        return (
            <SessionStateScreen variant="checking" />
        );
    }

    if (status === "error") {
        return (
            <SessionStateScreen
                variant="error"
                message={
                    error?.message ??
                    "The current session could not be validated."
                }
                onRetry={() => {
                    void refreshCurrentUser().catch(
                        () => undefined,
                    );
                }}
            />
        );
    }

    if (status === "disabled") {
        return (
            <SessionStateScreen
                variant="disabled"
                message={
                    error?.message ??
                    "This account cannot access the workspace."
                }
                onSignOut={() => {
                    void signOut();
                }}
            />
        );
    }

    if (
        status === "unauthenticated" ||
        !isAuthenticated
    ) {
        const returnTo = [
            location.pathname,
            location.search,
            location.hash,
        ].join("");

        return (
            <Navigate
                replace
                to="/login"
                state={createAuthRedirectState(
                    returnTo,
                    sessionNotice === "expired"
                        ? "session-expired"
                        : undefined,
                )}
            />
        );
    }

    return <Outlet />;
}