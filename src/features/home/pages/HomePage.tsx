import {
    ArrowRight,
    BookOpen,
    FileText,
    GraduationCap,
    LayoutDashboard,
    MessageSquare,
    TrendingUp,
} from "lucide-react";
import { Link } from "react-router";

import { PageHeader } from "@/components/layout";
import {
    Badge,
    Button,
    Card,
    buttonVariants,
} from "@/components/ui";

type HomeActionCard = {
    title: string;
    description: string;
    href: string;
    badge: string;
    icon: typeof BookOpen;
};

const primaryActions: HomeActionCard[] = [
    {
        title: "Courses",
        description:
            "Create course workspaces, upload documents, and manage your learning materials.",
        href: "/courses",
        badge: "Start here",
        icon: BookOpen,
    },
    {
        title: "Progress",
        description:
            "Review your learning activity, quiz progress, weak topics, and saved resources.",
        href: "/progress",
        badge: "Track",
        icon: TrendingUp,
    },
    {
        title: "Account",
        description:
            "View your profile and account information.",
        href: "/account",
        badge: "Settings",
        icon: GraduationCap,
    },
];

const workflowSteps = [
    {
        title: "Upload documents",
        description:
            "Add PDF or DOCX materials into a course workspace.",
        icon: FileText,
    },
    {
        title: "Ask cited questions",
        description:
            "Use AI Chat to get answers grounded in your course documents.",
        icon: MessageSquare,
    },
    {
        title: "Generate study resources",
        description:
            "Create summaries, quizzes and flashcards from your materials.",
        icon: LayoutDashboard,
    },
];

export function HomePage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl space-y-8">
                <PageHeader
                    eyebrow={
                        <Badge variant="ai">
                            AI learning workspace
                        </Badge>
                    }
                    title="Continue learning"
                    description="Manage your course documents, ask cited AI questions, and turn course content into summaries, quizzes and flashcards."
                    actions={
                        <Link
                            to="/courses"
                            className={buttonVariants({
                                variant: "primary",
                                size: "md",
                            })}
                        >
                            <BookOpen
                                className="size-4"
                                aria-hidden="true"
                            />
                            Go to courses
                        </Link>
                    }
                />

                <div className="grid gap-4 md:grid-cols-3">
                    {primaryActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                to={action.href}
                                className={[
                                    "group rounded-2xl border border-line bg-surface p-5",
                                    "transition-colors hover:border-brand-200 hover:bg-brand-50/40",
                                    "focus-visible:outline-2 focus-visible:outline-brand-600",
                                ].join(" ")}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-800">
                                        <Icon
                                            className="size-5"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <Badge variant="neutral">
                                        {action.badge}
                                    </Badge>
                                </div>

                                <h2 className="mt-5 text-base font-semibold text-text-primary">
                                    {action.title}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    {action.description}
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-brand-700">
                                    Open
                                    <ArrowRight
                                        className="size-4 transition-transform group-hover:translate-x-0.5"
                                        aria-hidden="true"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <Card className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                Recommended workflow
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-text-primary">
                                From course material to study practice
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                                The app is designed around a real learning flow:
                                upload documents, ask evidence-based questions,
                                then generate study resources for revision.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            disabled
                        >
                            Demo flow
                        </Button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {workflowSteps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.title}
                                    className="rounded-2xl border border-line bg-surface-muted p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid size-9 place-items-center rounded-xl bg-surface text-brand-800">
                                            <Icon
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <Badge variant="neutral">
                                            Step {index + 1}
                                        </Badge>
                                    </div>

                                    <h3 className="mt-4 text-sm font-semibold text-text-primary">
                                        {step.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </section>
        </main>
    );
}