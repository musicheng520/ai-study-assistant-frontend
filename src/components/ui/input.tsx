import {
    forwardRef,
    type ComponentPropsWithoutRef,
} from "react";

import { cn } from "@/lib/utils/cn";

export type InputProps =
    ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<
    HTMLInputElement,
    InputProps
>(function Input(
    {
        className,
        type = "text",
        ...props
    },
    ref,
) {
    return (
        <input
            ref={ref}
            className={cn(
                [
                    "h-11 w-full rounded-lg",
                    "border border-line bg-surface",
                    "px-3 text-sm text-text-primary",
                    "outline-none transition-colors",
                    "placeholder:text-text-muted",
                    "hover:border-slate-300",
                    "focus:border-brand-600",
                    "focus:ring-2",
                    "focus:ring-brand-100",
                    "disabled:cursor-not-allowed",
                    "disabled:bg-surface-muted",
                    "disabled:opacity-70",
                    "aria-[invalid=true]:border-red-500",
                    "aria-[invalid=true]:focus:border-red-500",
                    "aria-[invalid=true]:focus:ring-red-100",
                ],
                className,
            )}
            type={type}
            {...props}
        />
    );
});

Input.displayName = "Input";