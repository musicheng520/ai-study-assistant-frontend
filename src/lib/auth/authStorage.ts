const ACCESS_TOKEN_KEY = "ai-study-assistant.access-token";

function getAccessToken(): string | null {
    const sessionToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);

    if (sessionToken) {
        return sessionToken;
    }

    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token: string, rememberSession: boolean): void {
    clearAccessToken();

    const storage = rememberSession ? localStorage : sessionStorage;

    storage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAccessToken(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export const authStorage = {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
};