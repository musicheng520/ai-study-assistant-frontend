import { z } from "zod";

import { apiClient } from "@/lib/api/apiClient";
import { ApiError } from "@/lib/errors/ApiError";

const healthResponseSchema = z.object({
    status: z.string(),
    app: z.string(),
});

export type HealthResponse = z.infer<
    typeof healthResponseSchema
>;

export async function getHealth(
    signal?: AbortSignal,
): Promise<HealthResponse> {
    const response = await apiClient.get("/api/health", {
        signal,
    });

    const parsedResponse = healthResponseSchema.safeParse(
        response.data,
    );

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The backend health response does not match the expected contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}