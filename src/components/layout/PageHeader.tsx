import type { ReactNode } from "react";

type PageHeaderProps = {
    eyebrow?: ReactNode;
    title: string;
    description?: ReactNode;
    actions?: ReactNode;
};

export function PageHeader({
                               eyebrow,
                               title,
                               description,
                               actions,
                           }: PageHeaderProps) {
    return (
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                {eyebrow ? (
                    <div className="mb-4">
                        {eyebrow}
                    </div>
                ) : null}

                <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                    {title}
                </h1>

                {description ? (
                    <div className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                        {description}
                    </div>
                ) : null}
            </div>

            {actions ? (
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                    {actions}
                </div>
            ) : null}
        </header>
    );
}