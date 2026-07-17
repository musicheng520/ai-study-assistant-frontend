import {
    Calendar,
    Layers,
    PlayCircle,
    RefreshCcw,
    Trash2,
} from "lucide-react";
import { Link } from "react-router";

import {
    Badge,
    Button,
    Card,
    buttonVariants,
} from "@/components/ui";
import {
    getFlashcardSourceLabel,
    isWeakTopicFlashcardSource,
    useCourseFlashcardsQuery,
    useDeleteFlashcardMutation,
} from "@/features/flashcards";

type SavedFlashcardsPanelProps = {
    courseId: number;
};

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function SavedFlashcardsPanel({
                                         courseId,
                                     }: SavedFlashcardsPanelProps) {
    const flashcardsQuery =
        useCourseFlashcardsQuery(courseId);

    const deleteMutation =
        useDeleteFlashcardMutation();

    const cards = flashcardsQuery.data ?? [];

    const weakTopicCount = cards.filter((card) =>
        isWeakTopicFlashcardSource(card.sourceType),
    ).length;

    async function handleDelete(
        flashcardId: number,
    ) {
        if (
            !window.confirm(
                "Delete this flashcard?",
            )
        ) {
            return;
        }

        await deleteMutation.mutateAsync({
            flashcardId,
        });
    }

    return (
        <Card
            id="flashcards-library"
            className="scroll-mt-24 overflow-hidden"
        >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
                <div>
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                        <Layers
                            className="size-4"
                            aria-hidden="true"
                        />
                        Saved flashcards
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-text-primary">
                        Flashcard library
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        Start all-card review or weak-topic
                        review. Review intervals are currently
                        stored in browser localStorage until the
                        backend review endpoint is added.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        to={`/courses/${courseId}/flashcards/study`}
                        className={buttonVariants({
                            variant: "secondary",
                            size: "sm",
                        })}
                    >
                        <PlayCircle
                            className="size-4"
                            aria-hidden="true"
                        />
                        Study all
                    </Link>

                    <Link
                        to={`/courses/${courseId}/flashcards/study?mode=weak`}
                        className={buttonVariants({
                            variant: "secondary",
                            size: "sm",
                        })}
                    >
                        <PlayCircle
                            className="size-4"
                            aria-hidden="true"
                        />
                        Weak topics
                    </Link>

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                            void flashcardsQuery.refetch();
                        }}
                    >
                        <RefreshCcw
                            className="size-4"
                            aria-hidden="true"
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap gap-3">
                    <Badge variant="info">
                        {cards.length} total
                    </Badge>

                    <Badge variant="warning">
                        {weakTopicCount} weak-topic
                    </Badge>
                </div>

                {flashcardsQuery.isPending ? (
                    <div className="space-y-3">
                        {Array.from({
                            length: 4,
                        }).map((_, index) => (
                            <div
                                key={`flashcard-skeleton-${index}`}
                                className="rounded-2xl border border-line p-4"
                                aria-hidden="true"
                            >
                                <div className="h-4 w-1/3 rounded bg-surface-muted" />
                                <div className="mt-4 h-3 w-full rounded bg-surface-muted" />
                                <div className="mt-2 h-3 w-5/6 rounded bg-surface-muted" />
                            </div>
                        ))}
                    </div>
                ) : null}

                {flashcardsQuery.isError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-900">
                            Failed to load flashcards
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-800">
                            Try refreshing the flashcard library.
                        </p>
                    </div>
                ) : null}

                {!flashcardsQuery.isPending &&
                !flashcardsQuery.isError &&
                cards.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line bg-surface-muted p-6 text-center">
                        <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface text-text-muted">
                            <Layers
                                className="size-5"
                                aria-hidden="true"
                            />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-text-primary">
                            No saved flashcards yet
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            Generate a draft above, then save it
                            to build your flashcard library.
                        </p>
                    </div>
                ) : null}

                {!flashcardsQuery.isPending &&
                !flashcardsQuery.isError &&
                cards.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {cards.map((card) => (
                            <article
                                key={card.id}
                                className="rounded-2xl border border-line bg-surface p-4"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant={
                                            isWeakTopicFlashcardSource(
                                                card.sourceType,
                                            )
                                                ? "warning"
                                                : "info"
                                        }
                                    >
                                        {getFlashcardSourceLabel(
                                            card.sourceType,
                                        )}
                                    </Badge>

                                    <Badge variant="neutral">
                                        {card.difficulty}
                                    </Badge>

                                    <Badge variant="neutral">
                                        {card.topic}
                                    </Badge>
                                </div>

                                <h3 className="mt-3 text-sm font-semibold leading-6 text-text-primary">
                                    {card.front}
                                </h3>

                                <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-secondary">
                                    {card.back}
                                </p>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <span className="flex items-center gap-1 text-xs text-text-muted">
                                        <Calendar
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                        {formatDate(
                                            card.createdAt,
                                        )}
                                    </span>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={
                                            deleteMutation.isPending
                                        }
                                        onClick={() => {
                                            void handleDelete(
                                                card.id,
                                            );
                                        }}
                                    >
                                        <Trash2
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Delete
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : null}
            </div>
        </Card>
    );
}