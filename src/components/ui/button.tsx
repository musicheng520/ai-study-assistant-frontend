import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

import { buttonVariants } from "./button-variants";

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