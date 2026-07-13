import axios from "axios";

import { authStorage } from "@/lib/auth/authStorage.ts";
import { env } from "@/lib/config/env.ts";
import { toApiError } from "@/lib/errors/ApiError";

export const apiClient = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 15_000,
    headers: {
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const accessToken = authStorage.getAccessToken();

    if (accessToken) {
        config.headers.set(
            "Authorization",
            `Bearer ${accessToken}`,
        );
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiError(error)),
);