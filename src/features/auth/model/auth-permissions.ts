type MaybeUserWithRole = {
    role?: string | null;
    roles?: string[] | null;
};

export function isAdminUser(
    user: MaybeUserWithRole | null | undefined,
) {
    if (!user) {
        return false;
    }

    if (user.role === "ADMIN") {
        return true;
    }

    return user.roles?.includes("ADMIN") ?? false;
}