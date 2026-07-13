import { Link } from "react-router";

type AuthMode = "login" | "register";

type AuthPlaceholderPageProps = {
    mode: AuthMode;
};

export function AuthPlaceholderPage({
                                        mode,
                                    }: AuthPlaceholderPageProps) {
    const isLogin = mode === "login";

    const title = isLogin ? "Welcome back" : "Create your account";

    const description = isLogin
        ? "Login form will be implemented in M58."
        : "Registration form will be implemented in M58.";

    const alternativePath = isLogin ? "/register" : "/login";

    const alternativeLabel = isLogin
        ? "Create an account"
        : "Return to login";

    return (
        <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
            <section className="w-full max-w-md rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
                <Link
                    className="text-sm font-medium text-brand-700 hover:text-brand-800"
                    to="/"
                >
                    ← AI Study Assistant
                </Link>

                <h1 className="mt-8 text-2xl font-semibold tracking-tight text-text-primary">
                    {title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {description}
                </p>

                <div className="mt-8 rounded-xl border border-ai-100 bg-ai-50 p-4">
                    <p className="text-sm font-medium text-ai-700">
                        Authentication route configured
                    </p>
                </div>

                <Link
                    className="mt-6 inline-flex text-sm font-medium text-brand-700 hover:text-brand-800"
                    to={alternativePath}
                >
                    {alternativeLabel}
                </Link>
            </section>
        </main>
    );
}