import axios from "axios";

type BackendErrorResponse = {
    timestamp?: string;
    status?: number;
    error?: string;
    code?: string;
    message?: string;
    fieldErrors?: Record<string, string>;
    traceId?: string;
};

type ApiErrorOptions = {
    status: number | null;
    code: string;
    message: string;
    retryable: boolean;
    timestamp?: string;
    fieldErrors?: Record<string, string>;
    traceId?: string;
};

export class ApiError extends Error {
    readonly status: number | null;
    readonly code: string;
    readonly retryable: boolean;
    readonly timestamp?: string;
    readonly fieldErrors?: Record<string, string>;
    readonly traceId?: string;

    constructor(options: ApiErrorOptions) {
        super(options.message);

        this.name = "ApiError";
        this.status = options.status;
        this.code = options.code;
        this.retryable = options.retryable;
        this.timestamp = options.timestamp;
        this.fieldErrors = options.fieldErrors;
        this.traceId = options.traceId;
    }
}

function isBackendErrorResponse(
    value: unknown,
): value is BackendErrorResponse {
    return typeof value === "object" && value !== null;
}

function isRetryableStatus(status: number | null): boolean {
    if (status === null) {
        return true;
    }

    return status === 408 || status === 429 || status >= 500;
}

export function toApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (!axios.isAxiosError(error)) {
        return new ApiError({
            status: null,
            code: "UNKNOWN_FRONTEND_ERROR",
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected frontend error occurred.",
            retryable: false,
        });
    }

    if (error.code === "ERR_CANCELED") {
        return new ApiError({
            status: null,
            code: "REQUEST_CANCELLED",
            message: "The request was cancelled.",
            retryable: false,
        });
    }

    if (
        error.code === "ECONNABORTED" ||
        error.code === "ETIMEDOUT"
    ) {
        return new ApiError({
            status: null,
            code: "REQUEST_TIMEOUT",
            message:
                "The server took too long to respond. Please try again.",
            retryable: true,
        });
    }

    if (!error.response) {
        return new ApiError({
            status: null,
            code: "NETWORK_ERROR",
            message:
                "Unable to connect to the server. Check your network and backend service.",
            retryable: true,
        });
    }

    const status = error.response.status;
    const responseData = error.response.data;

    if (isBackendErrorResponse(responseData)) {
        return new ApiError({
            status,
            code: responseData.code ?? "API_REQUEST_FAILED",
            message:
                responseData.message ??
                responseData.error ??
                "The request could not be completed.",
            retryable: isRetryableStatus(status),
            timestamp: responseData.timestamp,
            fieldErrors: responseData.fieldErrors,
            traceId: responseData.traceId,
        });
    }

    return new ApiError({
        status,
        code: "API_REQUEST_FAILED",
        message: `The request failed with status ${status}.`,
        retryable: isRetryableStatus(status),
    });
}