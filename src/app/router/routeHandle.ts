export type AppRouteHandle = {
    pageTitle: string;
};

export function appRouteHandle(
    pageTitle: string,
): AppRouteHandle {
    return {
        pageTitle,
    };
}

export function isAppRouteHandle(
    value: unknown,
): value is AppRouteHandle {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const possibleHandle = value as {
        pageTitle?: unknown;
    };

    return typeof possibleHandle.pageTitle === "string";
}