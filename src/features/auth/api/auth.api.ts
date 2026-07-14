import {
    authResponseSchema,
    currentUserResponseSchema,
    type AuthResponse,
    type CurrentUser,
    type LoginRequest,
    type RegisterRequest,
} from "@/features/auth/model/auth.schema";
import { apiClient } from "@/lib/api/apiClient";
import { ApiError } from "@/lib/errors/ApiError";

function parseAuthResponse(
    responseData: unknown,
): AuthResponse {
    const parsedResponse =
        authResponseSchema.safeParse(responseData);

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The authentication response does not match the expected contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}

function parseCurrentUserResponse(
    responseData: unknown,
): CurrentUser {
    const parsedResponse =
        currentUserResponseSchema.safeParse(
            responseData,
        );

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The current-user response does not match the expected contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}

export async function login(
    request: LoginRequest,
): Promise<AuthResponse> {
    const response = await apiClient.post(
        "/api/auth/login",
        request,
    );

    return parseAuthResponse(response.data);
}

export async function register(
    request: RegisterRequest,
): Promise<AuthResponse> {
    const response = await apiClient.post(
        "/api/auth/register",
        request,
    );

    return parseAuthResponse(response.data);
}

export async function getCurrentUser(
    signal?: AbortSignal,
): Promise<CurrentUser> {
    const response = await apiClient.get(
        "/api/auth/me",
        {
            signal,
        },
    );

    return parseCurrentUserResponse(
        response.data,
    );
}