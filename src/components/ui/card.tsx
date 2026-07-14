import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

export function Card({
                         className,
                         ...props
                     }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "rounded-card border border-line bg-surface shadow-card",
                className,
            )}
            {...props}
        />
    );
}

export function CardHeader({
                               className,
                               ...props
                           }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex flex-col gap-1.5 p-5 sm:p-6",
                className,
            )}
            {...props}
        />
    );
}

export function CardTitle({
                              className,
                              ...props
                          }: ComponentProps<"h3">) {
    return (
        <h3
            className={cn(
                "text-base font-semibold tracking-tight text-text-primary",
                className,
            )}
            {...props}
        />
    );
}

export function CardDescription({
                                    className,
                                    ...props
                                }: ComponentProps<"p">) {
    return (
        <p
            className={cn(
                "text-sm leading-6 text-text-secondary",
                className,
            )}
            {...props}
        />
    );
}

export function CardContent({
                                className,
                                ...props
                            }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "px-5 pb-5 sm:px-6 sm:pb-6",
                className,
            )}
            {...props}
        />
    );
}

export function CardFooter({
                               className,
                               ...props
                           }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 border-t border-line px-5 py-4 sm:px-6",
                className,
            )}
            {...props}
        />
    );
}