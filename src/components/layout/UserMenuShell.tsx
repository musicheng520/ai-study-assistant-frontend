import {
    ChevronDown,
    LogOut,
    Settings,
    UserRound,
} from "lucide-react";
import {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { Link } from "react-router";

import { cn } from "@/lib/utils/cn";

export function UserMenuShell() {
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const menuId = useId();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handlePointerDown(event: PointerEvent) {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (!containerRef.current?.contains(target)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
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

    return (
        <div
            className="relative"
            ref={containerRef}
        >
            <button
                ref={triggerRef}
                aria-controls={menuId}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className={cn(
                    [
                        "flex items-center gap-2",
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
                    setIsOpen((currentValue) => !currentValue);
                }}
                type="button"
            >
        <span
            className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-800"
            aria-hidden="true"
        >
          <UserRound className="size-4" />
        </span>

                <span className="hidden min-w-0 sm:block">
          <span className="block max-w-32 truncate text-sm font-medium text-text-primary">
            Student account
          </span>

          <span className="block max-w-32 truncate text-xs text-text-muted">
            Auth pending
          </span>
        </span>

                <ChevronDown
                    className={cn(
                        "size-4 text-text-muted transition-transform",
                        isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                />
            </button>

            {isOpen ? (
                <div
                    id={menuId}
                    className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-card"
                    role="menu"
                    aria-label="Account menu"
                >
                    <div className="border-b border-line px-4 py-3">
                        <p className="text-sm font-medium text-text-primary">
                            Student account
                        </p>

                        <p className="mt-1 text-xs leading-5 text-text-muted">
                            Real user information will be loaded from
                            the authentication API in M58.
                        </p>
                    </div>

                    <div className="p-1.5">
                        <Link
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-brand-600"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            role="menuitem"
                            to="/account"
                        >
                            <Settings
                                className="size-4"
                                aria-hidden="true"
                            />
                            Account settings
                        </Link>

                        <button
                            className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-muted opacity-60"
                            disabled
                            role="menuitem"
                            type="button"
                        >
                            <LogOut
                                className="size-4"
                                aria-hidden="true"
                            />

                            <span className="flex-1">
                Sign out
              </span>

                            <span className="text-xs">
                M58
              </span>
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}