import { useIsFetching } from "@tanstack/react-query";
import { Link } from "react-router";

import { env } from "@/lib/config/env";

export function HomePage() {
    const activeRequestCount = useIsFetching();

    return (
        <main className="min-h-screen bg-canvas px-4 py-10 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-3xl rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
                <header className="flex items-start gap-4">
                    <div
                        className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-800 font-semibold text-white"
                        aria-hidden="true"
                    >
                        AI
                    </div>

                    <div>
                        <p className="text-sm font-medium text-brand-700">
                            Frontend foundation
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                            {env.appName}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                            Course-based AI learning workspace for documents, cited answers,
                            quizzes, flashcards and revision.
                        </p>
                    </div>
                </header>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <article className="rounded-xl border border-line bg-canvas p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                            Application routing
                        </p>

                        <p className="mt-2 font-medium text-text-primary">
                            React Router is ready
                        </p>
                    </article>

                    <article className="rounded-xl border border-line bg-canvas p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                            Server state
                        </p>

                        <p className="mt-2 font-medium text-text-primary">
                            {activeRequestCount} active requests
                        </p>
                    </article>
                </div>

                <div className="mt-6 rounded-xl border border-ai-100 bg-ai-50 px-4 py-3">
                    <p className="text-sm font-medium text-ai-700">
                        Router and TanStack Query providers loaded successfully.
                    </p>
                </div>

                <nav
                    className="mt-6 flex flex-wrap gap-3"
                    aria-label="Foundation routes"
                >
                    <Link
                        className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        to="/login"
                    >
                        Open login route
                    </Link>

                    <Link
                        className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        to="/register"
                    >
                        Open register route
                    </Link>
                </nav>

                <p className="mt-6 text-sm text-text-muted">
                    Backend API: {env.apiBaseUrl}
                </p>
            </section>
        </main>
    );
}