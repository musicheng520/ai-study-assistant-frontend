import type {
    LucideIcon,
} from "lucide-react";
import { Inbox } from "lucide-react";
import type {
    ReactNode,
} from "react";

type EmptyStateProps = {
    title: string;
    description: string;
    icon?: LucideIcon;
    action?: ReactNode;
    compact?: boolean;
};

export function EmptyState({
                               title,
                               description,
                               icon: Icon = Inbox,
                               action,
                               compact = false,
                           }: EmptyStateProps) {
    return (
        <section
            className={
                compact
                    ? "rounded-xl border border-dashed border-line bg-canvas p-5 text-center"
                    : "rounded-card border border-dashed border-line bg-surface p-8 text-center"
            }
        >
            <div className="mx-auto grid size-11 place-items-center rounded-xl bg-surface-muted">
                <Icon
                    className="size-5 text-text-muted"
                    aria-hidden="true"
                />
            </div>

            <h2 className="mt-4 text-base font-semibold text-text-primary">
                {title}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                {description}
            </p>

            {action ? (
                <div className="mt-5">
                    {action}
                </div>
            ) : null}
        </section>
    );
}