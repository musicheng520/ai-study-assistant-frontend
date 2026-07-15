import { X } from "lucide-react";
import {
    useEffect,
    useId,
    useRef,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils/cn";

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

type DialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
    preventClose?: boolean;
};

export function Dialog({
                           open,
                           onOpenChange,
                           title,
                           description,
                           children,
                           className,
                           preventClose = false,
                       }: DialogProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef =
        useRef<HTMLButtonElement>(null);

    const onOpenChangeRef =
        useRef(onOpenChange);

    const preventCloseRef =
        useRef(preventClose);

    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        onOpenChangeRef.current = onOpenChange;
        preventCloseRef.current = preventClose;
    }, [
        onOpenChange,
        preventClose,
    ]);

    function requestClose() {
        if (preventCloseRef.current) {
            return;
        }

        onOpenChangeRef.current(false);
    }

    useEffect(() => {
        if (!open) {
            return;
        }

        const previouslyFocusedElement =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

        const previousBodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const animationFrameId =
            window.requestAnimationFrame(() => {
                const firstFocusableElement =
                    panelRef.current?.querySelector<HTMLElement>(
                        '[data-autofocus="true"], input, textarea, select, button:not([disabled]), a[href]',
                    );

                firstFocusableElement?.focus();
            });

        function handleKeyDown(
            event: KeyboardEvent,
        ) {
            if (event.key === "Escape") {
                event.preventDefault();

                if (!preventCloseRef.current) {
                    onOpenChangeRef.current(false);
                }

                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const panel = panelRef.current;

            if (!panel) {
                return;
            }

            const focusableElements = Array.from(
                panel.querySelectorAll<HTMLElement>(
                    focusableSelector,
                ),
            );

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length - 1
                    ];

            if (!firstElement || !lastElement) {
                event.preventDefault();
                return;
            }

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (
                !event.shiftKey &&
                document.activeElement === lastElement
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
            window.cancelAnimationFrame(
                animationFrameId,
            );

            document.body.style.overflow =
                previousBodyOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            previouslyFocusedElement?.focus();
        };
    }, [open]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[70]">
            <button
                aria-label="Close dialog"
                className="absolute inset-0 cursor-default bg-slate-950/45"
                disabled={preventClose}
                onClick={requestClose}
                type="button"
            />

            <div className="relative flex min-h-full items-center justify-center overflow-y-auto px-4 py-8">
                <div
                    ref={panelRef}
                    aria-describedby={
                        description
                            ? descriptionId
                            : undefined
                    }
                    aria-labelledby={titleId}
                    aria-modal="true"
                    className={cn(
                        [
                            "relative w-full max-w-lg",
                            "overflow-hidden rounded-2xl",
                            "border border-line bg-surface",
                            "shadow-2xl",
                        ],
                        className,
                    )}
                    role="dialog"
                >
                    <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
                        <div className="min-w-0">
                            <h2
                                id={titleId}
                                className="text-lg font-semibold text-text-primary"
                            >
                                {title}
                            </h2>

                            {description ? (
                                <p
                                    id={descriptionId}
                                    className="mt-1 text-sm leading-6 text-text-secondary"
                                >
                                    {description}
                                </p>
                            ) : null}
                        </div>

                        <button
                            ref={closeButtonRef}
                            aria-label="Close dialog"
                            className={[
                                "grid size-9 shrink-0",
                                "place-items-center rounded-lg",
                                "text-text-muted",
                                "transition-colors",
                                "hover:bg-surface-muted",
                                "hover:text-text-primary",
                                "focus-visible:outline-2",
                                "focus-visible:outline-offset-2",
                                "focus-visible:outline-brand-600",
                                "disabled:cursor-not-allowed",
                                "disabled:opacity-50",
                            ].join(" ")}
                            disabled={preventClose}
                            onClick={requestClose}
                            type="button"
                        >
                            <X
                                className="size-5"
                                aria-hidden="true"
                            />
                        </button>
                    </header>

                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
}