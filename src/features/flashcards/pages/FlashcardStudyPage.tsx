import {
    ArrowLeft,
    RefreshCcw,
} from "lucide-react";
import {
    Link,
    useSearchParams,
} from "react-router";

import {
    Button,
    Card,
    buttonVariants,
} from "@/components/ui";
import { useCourseContext } from "@/features/courses/context/course-context";
import { useCourseFlashcardsQuery } from "@/features/flashcards/api";

import { FlashcardStudySession } from "../components/FlashcardStudySession";

function isWeakTopicSource(sourceType: string) {
    return (
        sourceType === "WEAK_TOPIC" ||
        sourceType === "WEAK_TOPICS" ||
        sourceType === "WRONG_TOPIC" ||
        sourceType === "WRONG_TOPICS" ||
        sourceType === "QUIZ_WRONG_TOPIC"
    );
}

export function FlashcardStudyPage() {
    const { course } = useCourseContext();
    const [
        searchParams,
    ] = useSearchParams();

    const mode =
        searchParams.get("mode") === "weak"
            ? "weak"
            : "all";

    const flashcardsQuery =
        useCourseFlashcardsQuery(course.id);

    const allCards =
        flashcardsQuery.data ?? [];

    const cards =
        mode === "weak"
            ? allCards.filter((card) =>
                isWeakTopicSource(card.sourceType),
            )
            : allCards;

    if (flashcardsQuery.isPending) {
        return (
            <Card className="p-6">
                <p className="text-sm text-text-secondary">
                    Loading flashcards...
                </p>
            </Card>
        );
    }

    if (flashcardsQuery.isError) {
        return (
            <Card className="p-6">
                <h1 className="text-lg font-semibold text-text-primary">
                    Failed to load flashcards
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                    The flashcard study session could not be
                    loaded.
                </p>

                <Button
                    className="mt-4"
                    variant="secondary"
                    onClick={() => {
                        void flashcardsQuery.refetch();
                    }}
                >
                    <RefreshCcw
                        className="size-4"
                        aria-hidden="true"
                    />
                    Retry
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Link
                to={`/courses/${course.id}/study`}
                className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                })}
            >
                <ArrowLeft
                    className="size-4"
                    aria-hidden="true"
                />
                Back to Study
            </Link>

            <FlashcardStudySession
                courseId={course.id}
                cards={cards}
                mode={mode}
            />
        </div>
    );
}