import {
    GraduationCap,
    Sparkles,
} from "lucide-react";
import { NavLink } from "react-router";

import { primaryNavigationItems } from "@/app/navigation/navigation";
import { cn } from "@/lib/utils/cn";

import { useAuth } from "@/features/auth/context";
import { isAdminUser } from "@/features/auth/model";

export function DesktopSidebar() {
    const { user } = useAuth();

    const visiblePrimaryNavigationItems =
        primaryNavigationItems.filter((item) => {
            if (!item.requiresAdmin) {
                return true;
            }

            return isAdminUser(user);
        });

    return (
        <aside className="hidden border-r border-line bg-surface lg:block">
            <div className="sticky top-0 flex h-screen flex-col">
                <div className="border-b border-line px-5 py-5">
                    <NavLink
                        className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
                        to="/"
                        aria-label="AI Study Assistant home"
                    >
                        <div
                            className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-800 text-white"
                            aria-hidden="true"
                        >
                            <GraduationCap className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text-primary">
                                AI Study Assistant
                            </p>

                            <p className="mt-0.5 truncate text-xs text-text-muted">
                                Learning workspace
                            </p>
                        </div>
                    </NavLink>
                </div>

                <nav
                    className="flex-1 overflow-y-auto px-3 py-5"
                    aria-label="Main navigation"
                >
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                        Workspace
                    </p>

                    <ul className="mt-3 space-y-1">
                        {visiblePrimaryNavigationItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <li key={item.to}>
                                    <NavLink
                                        className={({ isActive }) =>
                                            cn(
                                                [
                                                    "group flex items-center gap-3",
                                                    "rounded-xl px-3 py-2.5",
                                                    "text-sm font-medium",
                                                    "transition-colors",
                                                    "focus-visible:outline-2",
                                                    "focus-visible:outline-offset-2",
                                                    "focus-visible:outline-brand-600",
                                                ],
                                                isActive
                                                    ? "bg-brand-50 text-brand-800"
                                                    : [
                                                        "text-text-secondary",
                                                        "hover:bg-surface-muted",
                                                        "hover:text-text-primary",
                                                    ],
                                            )
                                        }
                                        end={item.end}
                                        to={item.to}
                                    >
                                        {({ isActive }) => (
                                            <>
                        <span
                            className={cn(
                                [
                                    "grid size-9 shrink-0",
                                    "place-items-center rounded-lg",
                                    "transition-colors",
                                ],
                                isActive
                                    ? "bg-brand-700 text-white"
                                    : [
                                        "bg-surface-muted",
                                        "text-text-muted",
                                        "group-hover:text-text-primary",
                                    ],
                            )}
                            aria-hidden="true"
                        >
                          <Icon className="size-[18px]" />
                        </span>

                                                <span className="min-w-0">
                          <span className="block truncate">
                            {item.label}
                          </span>

                          <span
                              className={cn(
                                  "mt-0.5 block truncate text-xs font-normal",
                                  isActive
                                      ? "text-brand-700"
                                      : "text-text-muted",
                              )}
                          >
                            {item.description}
                          </span>
                        </span>
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="border-t border-line p-4">
                    <div className="rounded-xl border border-ai-100 bg-ai-50 p-3.5">
                        <div className="flex items-start gap-3">
                            <div
                                className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-ai-700"
                                aria-hidden="true"
                            >
                                <Sparkles className="size-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-medium text-ai-700">
                                    Focused learning
                                </p>

                                <p className="mt-1 text-xs leading-5 text-text-secondary">
                                    Documents, practice and revision in one workspace.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}