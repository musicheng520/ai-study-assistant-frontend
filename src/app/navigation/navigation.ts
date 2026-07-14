import type { LucideIcon } from "lucide-react";
import {
    ChartNoAxesCombined,
    House,
    LibraryBig,
    UserRound,
} from "lucide-react";

export type AppNavigationItem = {
    label: string;
    description: string;
    to: string;
    icon: LucideIcon;
    end?: boolean;
};

export const primaryNavigationItems: AppNavigationItem[] = [
    {
        label: "Home",
        description: "Continue learning",
        to: "/",
        icon: House,
        end: true,
    },
    {
        label: "Courses",
        description: "Manage course workspaces",
        to: "/courses",
        icon: LibraryBig,
    },
    {
        label: "Progress",
        description: "Review your learning progress",
        to: "/progress",
        icon: ChartNoAxesCombined,
    },
];

export const secondaryNavigationItems: AppNavigationItem[] = [
    {
        label: "Account",
        description: "Profile and session settings",
        to: "/account",
        icon: UserRound,
    },
];