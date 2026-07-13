import {
    isRouteErrorResponse,
    Link,
    useRouteError,
} from "react-router";

export function RouteErrorBoundary() {
    const error = useRouteError();

    let title = "Something went wrong";

    let message =
        "An unexpected error prevented this page from loading.";

    if (isRouteErrorResponse(error)) {
        title = `${error.status} ${error.statusText || "Request error"}`;

        if (typeof error.data === "string" && error.data.trim()) {
            message = error.data;
        }
    }

    return (
        <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
            <section
                className="w-full max-w-lg rounded-card border border-line bg-surface p-6 shadow-card sm:p-8"
                role="alert"
            >
                <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
                    Application error
                </p>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
                    {title}
                </h1>

                <p className="mt-4 text-sm leading-6 text-text-secondary">
                    {message}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        onClick={() => window.location.reload()}
                        type="button"
                    >
                        Reload page
                    </button>

                    <Link
                        className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        to="/"
                    >
                        Return home
                    </Link>
                </div>
            </section>
        </main>
    );
}