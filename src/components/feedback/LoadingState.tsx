import { LoaderCircle } from "lucide-react";

type LoadingStateProps = {
    title?: string;
    description?: string;
    compact?: boolean;
};

export function LoadingState({
                                 title = "Loading",
                                 description = "Please wait while the content is being loaded.",
                                 compact = false,
                             }: LoadingStateProps) {
    return (
        <section
            className={
                compact
                    ? "rounded-xl border border-line bg-canvas p-4"
                    : "rounded-card border border-line bg-surface p-6 shadow-card"
            }
            aria-busy="true"
            aria-live="polite"
        >
            <div className="flex items-center gap-3">
                <LoaderCircle
                    className="size-5 shrink-0 animate-spin text-brand-700"
                    aria-hidden="true"
                />

                <div>
                    <p className="font-medium text-text-primary">
                        {title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}