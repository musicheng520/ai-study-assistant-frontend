import { Link } from "react-router";

export function NotFoundPage() {
    return (
        <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
            <section className="w-full max-w-lg text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                    404
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
                    Page not found
                </h1>

                <p className="mt-4 text-sm leading-6 text-text-secondary sm:text-base">
                    The page may have moved, been deleted, or the address may be
                    incorrect.
                </p>

                <Link
                    className="mt-8 inline-flex rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    to="/"
                >
                    Return home
                </Link>
            </section>
        </main>
    );
}