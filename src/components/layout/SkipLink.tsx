export function SkipLink() {
    return (
        <a
            className={[
                "fixed left-4 top-4 z-[100]",
                "-translate-y-24 rounded-lg",
                "bg-brand-800 px-4 py-2",
                "text-sm font-medium text-white",
                "shadow-card transition-transform",
                "focus:translate-y-0",
                "focus:outline-none",
                "focus:ring-2",
                "focus:ring-brand-300",
                "focus:ring-offset-2",
            ].join(" ")}
            href="#main-content"
        >
            Skip to main content
        </a>
    );
}