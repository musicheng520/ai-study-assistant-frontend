import {
    GraduationCap,
    LogOut,
    ShieldCheck,
    X,
} from "lucide-react";
import {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import {
    Link,
    useNavigate,
} from "react-router";

import { secondaryNavigationItems } from "@/app/navigation/navigation";
import { Badge } from "@/components/ui";
import { useAuth } from "@/features/auth/context";
import {
    getUserInitials,
    getUserRoleLabel,
} from "@/features/auth/model";

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

type MobileMoreSheetProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function MobileMoreSheet({
                                    isOpen,
                                    onClose,
                                }: MobileMoreSheetProps) {
    const navigate = useNavigate();

    const {
        user,
        signOut,
    } = useAuth();

    const [
        isSigningOut,
        setIsSigningOut,
    ] = useState(false);

    const panelRef =
        useRef<HTMLElement>(null);

    const closeButtonRef =
        useRef<HTMLButtonElement>(null);

    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previouslyFocusedElement =
            document.activeElement instanceof
            HTMLElement
                ? document.activeElement
                : null;

        const previousBodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        closeButtonRef.current?.focus();

        function handleKeyDown(
            event: KeyboardEvent,
        ) {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const panel =
                panelRef.current;

            if (!panel) {
                return;
            }

            const focusableElements =
                Array.from(
                    panel.querySelectorAll<HTMLElement>(
                        focusableSelector,
                    ),
                );

            if (
                focusableElements.length === 0
            ) {
                event.preventDefault();
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length - 1
                    ];

            if (
                !firstElement ||
                !lastElement
            ) {
                return;
            }

            if (
                event.shiftKey &&
                document.activeElement ===
                firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (
                !event.shiftKey &&
                document.activeElement ===
                lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousBodyOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            previouslyFocusedElement?.focus();
        };
    }, [
        isOpen,
        onClose,
    ]);

    if (!isOpen) {
        return null;
    }

    const initials = user
        ? getUserInitials(user)
        : "AS";

    const roleLabel = user
        ? getUserRoleLabel(user.role)
        : null;

    async function handleSignOut(): Promise<void> {
        if (isSigningOut) {
            return;
        }

        setIsSigningOut(true);

        await signOut();

        onClose();

        navigate("/login", {
            replace: true,
        });
    }

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="absolute inset-0 bg-slate-950/40"
                aria-hidden="true"
                onClick={onClose}
            />

            <section
                ref={panelRef}
                aria-describedby={descriptionId}
                aria-labelledby={titleId}
                aria-modal="true"
                className={[
                    "absolute inset-x-0 bottom-0",
                    "max-h-[85vh] overflow-y-auto",
                    "rounded-t-3xl",
                    "border-t border-line",
                    "bg-surface shadow-2xl",
                ].join(" ")}
                role="dialog"
            >
                <div
                    className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-slate-300"
                    aria-hidden="true"
                />

                <header className="flex items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-3">
                    <div className="min-w-0">
                        <h2
                            id={titleId}
                            className="text-lg font-semibold text-text-primary"
                        >
                            More
                        </h2>

                        <p
                            id={descriptionId}
                            className="mt-1 text-sm leading-6 text-text-secondary"
                        >
                            Account and application options.
                        </p>
                    </div>

                    <button
                        ref={closeButtonRef}
                        aria-label="Close more menu"
                        className={[
                            "grid size-10 shrink-0",
                            "place-items-center rounded-xl",
                            "text-text-secondary",
                            "transition-colors",
                            "hover:bg-surface-muted",
                            "hover:text-text-primary",
                            "focus-visible:outline-2",
                            "focus-visible:outline-offset-2",
                            "focus-visible:outline-brand-600",
                        ].join(" ")}
                        onClick={onClose}
                        type="button"
                    >
                        <X
                            className="size-5"
                            aria-hidden="true"
                        />
                    </button>
                </header>

                <div className="p-4">
                    {user ? (
                        <div className="rounded-2xl border border-line bg-canvas p-4">
                            <div className="flex items-start gap-3">
                                <div
                                    className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-sm font-semibold text-brand-800"
                                    aria-hidden="true"
                                >
                                    {initials}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-text-primary">
                                        {user.displayName ||
                                            "Account"}
                                    </p>

                                    <p className="mt-0.5 truncate text-sm text-text-secondary">
                                        {user.email}
                                    </p>

                                    {roleLabel ? (
                                        <Badge
                                            className="mt-2"
                                            variant={
                                                user.role === "ADMIN"
                                                    ? "ai"
                                                    : "info"
                                            }
                                        >
                                            <ShieldCheck
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />

                                            {roleLabel}
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-line bg-canvas p-4">
                            <div className="flex items-start gap-3">
                                <div
                                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-800 text-white"
                                    aria-hidden="true"
                                >
                                    <GraduationCap className="size-5" />
                                </div>

                                <div>
                                    <p className="font-medium text-text-primary">
                                        AI Study Assistant
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                                        Authentication information is
                                        currently unavailable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <nav
                        className="mt-4"
                        aria-label="Additional navigation"
                    >
                        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                            Account
                        </p>

                        <ul className="mt-2 space-y-1">
                            {secondaryNavigationItems.map(
                                (item) => {
                                    const Icon = item.icon;

                                    return (
                                        <li key={item.to}>
                                            <Link
                                                className={[
                                                    "flex items-center gap-3",
                                                    "rounded-xl px-3 py-3",
                                                    "text-text-secondary",
                                                    "transition-colors",
                                                    "hover:bg-surface-muted",
                                                    "hover:text-text-primary",
                                                    "focus-visible:outline-2",
                                                    "focus-visible:outline-offset-2",
                                                    "focus-visible:outline-brand-600",
                                                ].join(" ")}
                                                onClick={onClose}
                                                to={item.to}
                                            >
                        <span
                            className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-text-muted"
                            aria-hidden="true"
                        >
                          <Icon className="size-5" />
                        </span>

                                                <span className="min-w-0">
                          <span className="block text-sm font-medium text-text-primary">
                            {item.label}
                          </span>

                          <span className="mt-0.5 block text-xs leading-5 text-text-muted">
                            {item.description}
                          </span>
                        </span>
                                            </Link>
                                        </li>
                                    );
                                },
                            )}
                        </ul>
                    </nav>

                    <div className="mt-4 border-t border-line pt-4">
                        <button
                            className={[
                                "flex w-full items-center gap-3",
                                "rounded-xl px-3 py-3",
                                "text-left text-red-700",
                                "transition-colors",
                                "hover:bg-red-50",
                                "focus-visible:outline-2",
                                "focus-visible:outline-offset-2",
                                "focus-visible:outline-red-600",
                                "disabled:cursor-not-allowed",
                                "disabled:opacity-60",
                            ].join(" ")}
                            disabled={isSigningOut}
                            onClick={() => {
                                void handleSignOut();
                            }}
                            type="button"
                        >
              <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700"
                  aria-hidden="true"
              >
                <LogOut className="size-5" />
              </span>

                            <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {isSigningOut
                      ? "Signing out..."
                      : "Sign out"}
                </span>

                <span className="mt-0.5 block text-xs text-red-600">
                  Clear the current session
                  from this browser.
                </span>
              </span>
                        </button>
                    </div>
                </div>

                <div
                    className="h-[env(safe-area-inset-bottom)]"
                    aria-hidden="true"
                />
            </section>
        </div>
    );
}