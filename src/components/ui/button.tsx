import type { ButtonHTMLAttributes } from "react";
import {
    cva,
    type VariantProps,
} from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2",
        "rounded-lg text-sm font-medium",
        "transition-colors",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-brand-600",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
    ],
    {
        variants: {
            variant: {
                primary:
                    "bg-brand-700 text-white hover:bg-brand-800",

                secondary:
                    "border border-line bg-surface text-text-primary hover:bg-surface-muted",

                ghost:
                    "text-text-secondary hover:bg-surface-muted hover:text-text-primary",

                destructive:
                    "bg-red-600 text-white hover:bg-red-700",

                ai:
                    "bg-ai-600 text-white hover:bg-ai-700",

                outline:
                    "border border-brand-200 bg-surface text-brand-700 hover:bg-brand-50",

                link:
                    "h-auto rounded-none p-0 text-brand-700 underline-offset-4 hover:underline",
            },

            size: {
                sm: "h-8 px-3",
                md: "h-10 px-4",
                lg: "h-11 px-5 text-base",
                icon: "size-10 p-0",
            },
        },

        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
);

export type ButtonProps =
    ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants>;

export function Button({
                           className,
                           variant,
                           size,
                           type = "button",
                           ...props
                       }: ButtonProps) {
    return (
        <button
            className={cn(
                buttonVariants({
                    variant,
                    size,
                }),
                className,
            )}
            type={type}
            {...props}
        />
    );
}