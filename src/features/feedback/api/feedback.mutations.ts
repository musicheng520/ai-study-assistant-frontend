import {
    useMutation,
} from "@tanstack/react-query";

import { createAiFeedback } from "./feedback.api";

export function useCreateAiFeedbackMutation() {
    return useMutation({
        mutationFn: createAiFeedback,
    });
}