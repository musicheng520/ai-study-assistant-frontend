import { apiClient } from "@/lib/api/apiClient";

import {
    aiFeedbackResponseSchema,
} from "../model";
import type {
    AiFeedbackCreateRequest,
    AiFeedbackResponse,
} from "../model";

export async function createAiFeedback(
    request: AiFeedbackCreateRequest,
): Promise<AiFeedbackResponse> {
    const response = await apiClient.post<unknown>(
        "/api/feedback",
        request,
    );

    return aiFeedbackResponseSchema.parse(
        response.data,
    );
}