import { GraduationCap } from "lucide-react";
import { useMatches } from "react-router";

import { isAppRouteHandle } from "@/app/router/routeHandle";
import { UserMenuShell } from "@/components/layout/UserMenuShell";

export function AppHeader() {
    const matches = useMatches();

    let pageTitle = "Workspace";

    for (const match of [...matches].reverse()) {
        if (isAppRouteHandle(match.handle)) {
            pageTitle = match.handle.pageTitle;
            break;
        }
    }

    return (
        <header className="sticky top-0 z-30 border-b border-line bg-surface">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-800 text-white lg:hidden"
                        aria-hidden="true"
                    >
                        <GraduationCap className="size-[18px]" />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-xs text-text-muted">
                            AI Study Assistant
                        </p>

                        <p className="truncate text-sm font-semibold text-text-primary">
                            {pageTitle}
                        </p>
                    </div>
                </div>

                <UserMenuShell />
            </div>
        </header>
    );
}