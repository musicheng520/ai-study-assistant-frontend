export type AuthRedirectReason =
    "session-expired";

export type AuthRedirectState = {
    returnTo: string;
    reason?: AuthRedirectReason;
};

type ParsedAuthRedirectState = {
    returnTo: string;
    reason: AuthRedirectReason | null;
};

function isSafeInternalPath(
    value: string,
): boolean {
    return (
        value.startsWith("/") &&
        !value.startsWith("//") &&
        !value.includes("\\")
    );
}

export function createAuthRedirectState(
    returnTo: string,
    reason?: AuthRedirectReason,
): AuthRedirectState {
    return {
        returnTo,
        ...(reason
            ? {
                reason,
            }
            : {}),
    };
}

export function parseAuthRedirectState(
    value: unknown,
): ParsedAuthRedirectState {
    if (
        typeof value !== "object" ||
        value === null
    ) {
        return {
            returnTo: "/",
            reason: null,
        };
    }

    const possibleState =
        value as Record<string, unknown>;

    const returnTo =
        typeof possibleState.returnTo ===
        "string" &&
        isSafeInternalPath(
            possibleState.returnTo,
        )
            ? possibleState.returnTo
            : "/";

    const reason =
        possibleState.reason ===
        "session-expired"
            ? "session-expired"
            : null;

    return {
        returnTo,
        reason,
    };
}