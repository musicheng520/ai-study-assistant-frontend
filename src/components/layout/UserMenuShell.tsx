import {
    ChevronDown,
    LogOut,
    Settings,
    ShieldCheck,
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

import { Badge } from "@/components/ui";
import { useAuth } from "@/features/auth/context";
import {
    getUserInitials,
    getUserRoleLabel,
} from "@/features/auth/model";
import { cn } from "@/lib/utils/cn";

export function UserMenuShell() {
    const navigate = useNavigate();

    const {
        user,
        signOut,
    } = useAuth();

    const [
        isOpen,
        setIsOpen,
    ] = useState(false);

    const [
        isSigningOut,
        setIsSigningOut,
    ] = useState(false);

    const containerRef =
        useRef<HTMLDivElement>(null);

    const triggerRef =
        useRef<HTMLButtonElement>(null);

    const panelId = useId();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handlePointerDown(
            event: PointerEvent,
        ) {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (
                !containerRef.current?.contains(
                    target,
                )
            ) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(
            event: KeyboardEvent,
        ) {
            if (event.key !== "Escape") {
                return;
            }

            setIsOpen(false);

            triggerRef.current?.focus();
        }

        document.addEventListener(
            "pointerdown",
            handlePointerDown,
        );

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown,
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [isOpen]);

    if (!user) {
        return null;
    }

    const initials =
        getUserInitials(user);

    const roleLabel =
        getUserRoleLabel(user.role);

    async function handleSignOut(): Promise<void> {
        if (isSigningOut) {
            return;
        }

        setIsSigningOut(true);
        setIsOpen(false);

        await signOut();

        navigate("/login", {
            replace: true,
        });
    }

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            <button
                ref={triggerRef}
                aria-controls={panelId}
                aria-expanded={isOpen}
                aria-label={`Open account options for ${
                    user.displayName || user.email
                }`}
                className={cn(
                    [
                        "flex min-w-0 items-center gap-2",
                        "rounded-xl border border-line",
                        "bg-surface px-2 py-1.5",
                        "text-left transition-colors",
                        "hover:bg-surface-muted",
                        "focus-visible:outline-2",
                        "focus-visible:outline-offset-2",
                        "focus-visible:outline-brand-600",
                    ],
                    isOpen && "bg-surface-muted",
                )}
                onClick={() => {
                    setIsOpen(
                        (currentValue) =>
                            !currentValue,
                    );
                }}
                type="button"
            >
        <span
            className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-xs font-semibold text-brand-800"
            aria-hidden="true"
        >
          {initials}
        </span>

                <span className="hidden min-w-0 sm:block">
          <span className="block max-w-36 truncate text-sm font-medium text-text-primary">
            {user.displayName ||
                "Account"}
          </span>

          <span className="block max-w-36 truncate text-xs text-text-muted">
            {user.email}
          </span>
        </span>

                <ChevronDown
                    className={cn(
                        [
                            "size-4 shrink-0",
                            "text-text-muted",
                            "transition-transform",
                        ],
                        isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                />
            </button>

            {isOpen ? (
                <div
                    id={panelId}
                    className={[
                        "absolute right-0 z-50 mt-2",
                        "w-[min(19rem,calc(100vw-2rem))]",
                        "overflow-hidden rounded-xl",
                        "border border-line bg-surface",
                        "shadow-card",
                    ].join(" ")}
                    aria-label="Account options"
                >
                    <div className="border-b border-line p-4">
                        <div className="flex items-start gap-3">
                            <div
                                className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-sm font-semibold text-brand-800"
                                aria-hidden="true"
                            >
                                {initials}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-text-primary">
                                    {user.displayName ||
                                        "Account"}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-text-muted">
                                    {user.email}
                                </p>

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
                            </div>
                        </div>
                    </div>

                    <div className="p-1.5">
                        <Link
                            className={[
                                "flex w-full items-center gap-3",
                                "rounded-lg px-3 py-2.5",
                                "text-sm text-text-secondary",
                                "transition-colors",
                                "hover:bg-surface-muted",
                                "hover:text-text-primary",
                                "focus-visible:outline-2",
                                "focus-visible:outline-brand-600",
                            ].join(" ")}
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            to="/account"
                        >
                            <Settings
                                className="size-4"
                                aria-hidden="true"
                            />

                            Account settings
                        </Link>

                        <button
                            className={[
                                "flex w-full items-center gap-3",
                                "rounded-lg px-3 py-2.5",
                                "text-left text-sm text-red-700",
                                "transition-colors",
                                "hover:bg-red-50",
                                "focus-visible:outline-2",
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
                            <LogOut
                                className="size-4"
                                aria-hidden="true"
                            />

                            {isSigningOut
                                ? "Signing out..."
                                : "Sign out"}
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}