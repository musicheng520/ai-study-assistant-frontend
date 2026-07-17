import {
    BookOpen,
    CheckCircle2,
    FileText,
    Layers,
    ListChecks,
    Sparkles,
} from "lucide-react";

import {
    Badge,
    Button,
    Card,
} from "@/components/ui";
import { useCourseContext } from "@/features/courses/context/course-context";

type StudyFeatureCard = {
    title: string;
    description: string;
    badge: string;
    status: "ready" | "next";
    icon: typeof Sparkles;
};

const studyFeatures: StudyFeatureCard[] = [
    {
        title: "Summary",
        description:
            "Generate course-level revision notes, key concepts and definitions from READY documents.",
        badge: "M62",
        status: "ready",
        icon: FileText,
    },
    {
        title: "Quiz",
        description:
            "Generate MCQ and short-answer draft questions, then save them as learning resources.",
        badge: "M63",
        status: "next",
        icon: ListChecks,
    },
    {
        title: "Flashcards",
        description:
            "Generate revision flashcards from course materials or weak topics.",
        badge: "M63",
        status: "next",
        icon: Layers,
    },
];

export function StudyHubPage() {
    const { course } = useCourseContext();

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <div className="border-b border-line px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                                <BookOpen
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Study workspace
                            </p>

                            <h1 className="mt-2 text-2xl font-semibold text-text-primary">
                                Generate learning resources for{" "}
                                {course.name}
                            </h1>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                                Turn uploaded course documents
                                into summaries, quizzes and
                                flashcards. Generated content will
                                first appear as a draft, then you
                                can save it into your formal study
                                library.
                            </p>
                        </div>

                        <Badge variant="info">
                            AI Study
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
                    {studyFeatures.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-line bg-surface p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="grid size-10 place-items-center rounded-xl bg-ai-50 text-ai-700">
                                        <Icon
                                            className="size-5"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <Badge
                                        variant={
                                            feature.status ===
                                            "ready"
                                                ? "success"
                                                : "neutral"
                                        }
                                    >
                                        {feature.badge}
                                    </Badge>
                                </div>

                                <h2 className="mt-4 text-base font-semibold text-text-primary">
                                    {feature.title}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    {feature.description}
                                </p>

                                <div className="mt-4">
                                    {feature.status ===
                                    "ready" ? (
                                        <Button
                                            size="sm"
                                            disabled
                                        >
                                            <Sparkles
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                            Generator coming in M62.3
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            disabled
                                        >
                                            Coming next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card className="p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-800">
                        <CheckCircle2
                            className="size-5"
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-text-primary">
                            M62 current scope
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            This page is now connected to the
                            Course Workspace route. The Summary
                            data layer is prepared in M62.2.
                            The next step will add the real
                            Generate Summary Draft UI and connect
                            it to the backend.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}