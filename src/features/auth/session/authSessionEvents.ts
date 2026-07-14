type AuthSessionExpiredListener = () => void;

const sessionExpiredListeners =
    new Set<AuthSessionExpiredListener>();

export function notifyAuthSessionExpired(): void {
    for (const listener of sessionExpiredListeners) {
        listener();
    }
}

export function subscribeAuthSessionExpired(
    listener: AuthSessionExpiredListener,
): () => void {
    sessionExpiredListeners.add(listener);

    return () => {
        sessionExpiredListeners.delete(listener);
    };
}