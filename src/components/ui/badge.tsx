import type { ComponentProps } from "react";
import {
    cva,
    type VariantProps,
} from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
    [
        "inline-flex items-center gap-1.5",
        "rounded-full border px-2.5 py-1",
        "text-xs font-medium leading-none",
    ],
    {
        variants: {
            variant: {
                neutral:
                    "border-line bg-surface-muted text-text-secondary",

                info:
                    "border-brand-200 bg-brand-50 text-brand-700",

                success:
                    "border-emerald-200 bg-emerald-50 text-emerald-700",

                warning:
                    "border-amber-200 bg-amber-50 text-amber-800",

                destructive:
                    "border-red-200 bg-red-50 text-red-700",

                ai:
                    "border-ai-100 bg-ai-50 text-ai-700",
            },
        },

        defaultVariants: {
            variant: "neutral",
        },
    },
);

export type BadgeProps =
    ComponentProps<"span"> &
    VariantProps<typeof badgeVariants>;

export function Badge({
                          className,
                          variant,
                          ...props
                      }: BadgeProps) {
    return (
        <span
            className={cn(
                badgeVariants({ variant }),
                className,
            )}
            {...props}
        />
    );
}