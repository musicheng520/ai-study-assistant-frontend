import { Ellipsis } from "lucide-react";
import {
    useCallback,
    useState,
} from "react";
import {
    NavLink,
    useLocation,
} from "react-router";

import {
    primaryNavigationItems,
    secondaryNavigationItems,
} from "@/app/navigation/navigation";
import { MobileMoreSheet } from "@/components/layout/MobileMoreSheet";
import { cn } from "@/lib/utils/cn";

export function MobileBottomNavigation() {
    const [isMoreOpen, setIsMoreOpen] =
        useState(false);

    const location = useLocation();

    const closeMoreMenu = useCallback(() => {
        setIsMoreOpen(false);
    }, []);

    const moreRouteIsActive =
        secondaryNavigationItems.some((item) => {
            if (location.pathname === item.to) {
                return true;
            }

            return location.pathname.startsWith(
                `${item.to}/`,
            );
        });

    const moreIsActive =
        isMoreOpen || moreRouteIsActive;

    return (
        <>
            <nav
                className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
                aria-label="Mobile navigation"
            >
                <div className="grid h-16 grid-cols-4 px-2">
                    {primaryNavigationItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.to}
                                className={({ isActive }) =>
                                    cn(
                                        [
                                            "relative flex min-w-0",
                                            "flex-col items-center",
                                            "justify-center gap-1",
                                            "rounded-xl px-1",
                                            "text-[11px] font-medium",
                                            "transition-colors",
                                            "focus-visible:outline-2",
                                            "focus-visible:outline-offset-[-4px]",
                                            "focus-visible:outline-brand-600",
                                        ],
                                        isActive
                                            ? "text-brand-800"
                                            : "text-text-muted hover:text-text-primary",
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
                                "grid size-8 place-items-center",
                                "rounded-xl transition-colors",
                            ],
                            isActive
                                ? "bg-brand-100 text-brand-800"
                                : "text-text-muted",
                        )}
                        aria-hidden="true"
                    >
                      <Icon className="size-5" />
                    </span>

                                        <span className="max-w-full truncate">
                      {item.label}
                    </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}

                    <button
                        aria-expanded={isMoreOpen}
                        aria-haspopup="dialog"
                        className={cn(
                            [
                                "relative flex min-w-0",
                                "flex-col items-center",
                                "justify-center gap-1",
                                "rounded-xl px-1",
                                "text-[11px] font-medium",
                                "transition-colors",
                                "focus-visible:outline-2",
                                "focus-visible:outline-offset-[-4px]",
                                "focus-visible:outline-brand-600",
                            ],
                            moreIsActive
                                ? "text-brand-800"
                                : "text-text-muted hover:text-text-primary",
                        )}
                        onClick={() => {
                            setIsMoreOpen(true);
                        }}
                        type="button"
                    >
            <span
                className={cn(
                    [
                        "grid size-8 place-items-center",
                        "rounded-xl transition-colors",
                    ],
                    moreIsActive
                        ? "bg-brand-100 text-brand-800"
                        : "text-text-muted",
                )}
                aria-hidden="true"
            >
              <Ellipsis className="size-5" />
            </span>

                        <span>More</span>
                    </button>
                </div>

                <div
                    className="h-[env(safe-area-inset-bottom)]"
                    aria-hidden="true"
                />
            </nav>

            <MobileMoreSheet
                isOpen={isMoreOpen}
                onClose={closeMoreMenu}
            />
        </>
    );
}