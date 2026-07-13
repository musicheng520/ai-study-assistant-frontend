import type {
    ReactNode,
} from "react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

type AsyncBoundaryProps = {
    isLoading: boolean;
    isError: boolean;
    isEmpty?: boolean;

    loadingTitle?: string;
    loadingDescription?: string;

    errorTitle?: string;
    errorMessage?: string;
    onRetry?: () => void;

    emptyTitle?: string;
    emptyDescription?: string;
    emptyAction?: ReactNode;

    compact?: boolean;
    children: ReactNode;
};

export function AsyncBoundary({
                                  isLoading,
                                  isError,
                                  isEmpty = false,

                                  loadingTitle,
                                  loadingDescription,

                                  errorTitle,
                                  errorMessage = "The requested content could not be loaded.",
                                  onRetry,

                                  emptyTitle = "No content available",
                                  emptyDescription = "There is currently nothing to display.",
                                  emptyAction,

                                  compact = false,
                                  children,
                              }: AsyncBoundaryProps) {
    if (isLoading) {
        return (
            <LoadingState
                title={loadingTitle}
                description={loadingDescription}
                compact={compact}
            />
        );
    }

    if (isError) {
        return (
            <ErrorState
                title={errorTitle}
                message={errorMessage}
                onRetry={onRetry}
                compact={compact}
            />
        );
    }

    if (isEmpty) {
        return (
            <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                action={emptyAction}
                compact={compact}
            />
        );
    }

    return children;
}