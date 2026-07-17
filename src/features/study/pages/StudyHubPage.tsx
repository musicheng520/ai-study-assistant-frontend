import {
    BookOpen,
    FileText,
    Layers,
    ListChecks,
} from "lucide-react";

import {
    Badge,
    Button,
    Card,
} from "@/components/ui";
import { useCourseContext } from "@/features/courses/context/course-context";

import { FlashcardGeneratorPanel } from "../components/FlashcardGeneratorPanel";
import { QuizGeneratorPanel } from "../components/QuizGeneratorPanel";
import { SavedFlashcardsPanel } from "../components/SavedFlashcardsPanel";
import { SavedQuizzesPanel } from "../components/SavedQuizzesPanel";
import { SavedSummariesPanel } from "../components/SavedSummariesPanel";
import { SummaryGeneratorPanel } from "../components/SummaryGeneratorPanel";

type StudyFeatureCard = {
    title: string;
    description: string;
    badge: string;
    status: "active";
    icon: typeof FileText;
};

const studyFeatures: StudyFeatureCard[] = [
    {
        title: "Summary",
        description:
            "Generate course-level revision notes, key concepts and definitions from READY documents.",
        badge: "M62",
        status: "active",
        icon: FileText,
    },
    {
        title: "Quiz",
        description:
            "Generate MCQ and short-answer questions, save quizzes, and submit attempts.",
        badge: "M63",
        status: "active",
        icon: ListChecks,
    },
    {
        title: "Flashcards",
        description:
            "Generate flashcards, save them, and review with Again / Good / Easy intervals.",
        badge: "M63.3",
        status: "active",
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
                                flashcards. Generated content
                                first appears as a draft, then
                                you can save it into your formal
                                study library.
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

                                    <Badge variant="success">
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
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled
                                    >
                                        Active below
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <SummaryGeneratorPanel
                courseId={course.id}
            />

            <SavedSummariesPanel
                courseId={course.id}
            />

            <QuizGeneratorPanel courseId={course.id} />

            <SavedQuizzesPanel courseId={course.id} />

            <FlashcardGeneratorPanel
                courseId={course.id}
            />

            <SavedFlashcardsPanel
                courseId={course.id}
            />
        </div>
    );
}