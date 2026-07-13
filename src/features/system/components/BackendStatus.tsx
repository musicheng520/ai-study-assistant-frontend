import {
    CircleAlert,
    CircleCheck,
    LoaderCircle,
    RotateCw,
} from "lucide-react";

import { useHealthQuery } from "@/features/system/api/system.queries";

export function BackendStatus() {
    const healthQuery = useHealthQuery();

    if (healthQuery.isPending) {
        return (
            <section
                className="rounded-xl border border-line bg-canvas p-4"
                aria-live="polite"
            >
                <div className="flex items-center gap-3">
                    <LoaderCircle
                        className="size-5 animate-spin text-brand-700"
                        aria-hidden="true"
                    />

                    <div>
                        <p className="font-medium text-text-primary">
                            Checking backend
                        </p>

                        <p className="mt-1 text-sm text-text-secondary">
                            Connecting to the Spring Boot API.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (healthQuery.isError) {
        const message =
            healthQuery.error instanceof Error
                ? healthQuery.error.message
                : "The backend health check failed.";

        return (
            <section
                className="rounded-xl border border-red-200 bg-red-50 p-4"
                role="alert"
            >
                <div className="flex items-start gap-3">
                    <CircleAlert
                        className="mt-0.5 size-5 shrink-0 text-red-700"
                        aria-hidden="true"
                    />

                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-red-900">
                            Backend unavailable
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-800">
                            {message}
                        </p>

                        <button
                            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                            onClick={() => healthQuery.refetch()}
                            type="button"
                        >
                            <RotateCw
                                className="size-4"
                                aria-hidden="true"
                            />
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
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
                        {healthQuery.data.app} ·{" "}
                        {healthQuery.data.status}
                    </p>
                </div>
            </div>
        </section>
    );
}