import {
    CircleAlert,
    RotateCw,
} from "lucide-react";

type ErrorStateProps = {
    title?: string;
    message: string;
    retryLabel?: string;
    onRetry?: () => void;
    compact?: boolean;
};

export function ErrorState({
                               title = "Unable to load content",
                               message,
                               retryLabel = "Try again",
                               onRetry,
                               compact = false,
                           }: ErrorStateProps) {
    return (
        <section
            className={
                compact
                    ? "rounded-xl border border-red-200 bg-red-50 p-4"
                    : "rounded-card border border-red-200 bg-red-50 p-6"
            }
            role="alert"
        >
            <div className="flex items-start gap-3">
                <CircleAlert
                    className="mt-0.5 size-5 shrink-0 text-red-700"
                    aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                    <p className="font-medium text-red-900">
                        {title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-800">
                        {message}
                    </p>

                    {onRetry ? (
                        <button
                            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                            onClick={onRetry}
                            type="button"
                        >
                            <RotateCw
                                className="size-4"
                                aria-hidden="true"
                            />

                            {retryLabel}
                        </button>
                    ) : null}
                </div>
            </div>
        </section>
    );
}