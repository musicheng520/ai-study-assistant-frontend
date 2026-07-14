import axios from "axios";

import { notifyAuthSessionExpired } from "@/features/auth/session/authSessionEvents";
import { authStorage } from "@/lib/auth/authStorage";
import { env } from "@/lib/config/env";
import { toApiError } from "@/lib/errors/ApiError";

export const apiClient = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 15_000,
    headers: {
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const accessToken =
        authStorage.getAccessToken();

    if (accessToken) {
        config.headers.set(
            "Authorization",
            `Bearer ${accessToken}`,
        );
    }

    return config;
});

function isPublicAuthRequest(
    requestUrl?: string,
): boolean {
    if (!requestUrl) {
        return false;
    }

    const urlWithoutQuery =
        requestUrl.split("?")[0];

    return (
        urlWithoutQuery.endsWith(
            "/api/auth/login",
        ) ||
        urlWithoutQuery.endsWith(
            "/api/auth/register",
        )
    );
}

apiClient.interceptors.response.use(
    (response) => response,

    (error: unknown) => {
        const apiError = toApiError(error);

        if (
            apiError.status === 401 &&
            authStorage.getAccessToken() &&
            axios.isAxiosError(error) &&
            !isPublicAuthRequest(
                error.config?.url,
            )
        ) {
            notifyAuthSessionExpired();
        }

        return Promise.reject(apiError);
    },
);