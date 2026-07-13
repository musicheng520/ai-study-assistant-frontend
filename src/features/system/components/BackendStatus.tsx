import { CircleCheck } from "lucide-react";

import { AsyncBoundary } from "@/components/feedback/AsyncBoundary";
import { useHealthQuery } from "@/features/system/api/system.queries";

export function BackendStatus() {
    const healthQuery = useHealthQuery();

    const errorMessage =
        healthQuery.error instanceof Error
            ? healthQuery.error.message
            : "The backend health check failed.";

    return (
        <AsyncBoundary
            compact
            isLoading={healthQuery.isPending}
            isError={healthQuery.isError}
            loadingTitle="Checking backend"
            loadingDescription="Connecting to the Spring Boot API."
            errorTitle="Backend unavailable"
            errorMessage={errorMessage}
            onRetry={() => {
                void healthQuery.refetch();
            }}
        >
            <section
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                aria-live="polite"
            >
                <div className="flex items-start gap-3">
                    <CircleCheck
                        className="mt-0.5 size-5 shrink-0 text-emerald-700"
                        aria-hidden="true"
                    />

                    <div>
                        <p className="font-medium text-emerald-900">
                            Backend connected
                        </p>

                        <p className="mt-1 text-sm text-emerald-800">
                            {healthQuery.data?.app} ·{" "}
                            {healthQuery.data?.status}
                        </p>
                    </div>
                </div>
            </section>
        </AsyncBoundary>
    );
}