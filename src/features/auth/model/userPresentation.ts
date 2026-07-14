import type {
    CurrentUser,
    UserRole,
} from "@/features/auth/model/auth.schema";

type UserIdentitySource = Pick<
    CurrentUser,
    "displayName" | "email"
>;

export function getUserInitials(
    user: UserIdentitySource,
): string {
    const trimmedDisplayName =
        user.displayName.trim();

    const emailName =
        user.email.split("@")[0] ?? "";

    const source =
        trimmedDisplayName || emailName || "User";

    const nameParts = source
        .split(/[\s._-]+/)
        .filter(Boolean);

    const firstPart =
        nameParts[0] ?? "U";

    if (nameParts.length === 1) {
        return firstPart
            .slice(0, 2)
            .toUpperCase();
    }

    const lastPart =
        nameParts[nameParts.length - 1] ??
        firstPart;

    return [
        firstPart.charAt(0),
        lastPart.charAt(0),
    ]
        .join("")
        .toUpperCase();
}

export function getUserRoleLabel(
    role: UserRole,
): string {
    if (role === "ADMIN") {
        return "Administrator";
    }

    return "User";
}