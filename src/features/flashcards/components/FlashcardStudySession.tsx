import {
    CheckCircle2,
    RotateCcw,
    Sparkles,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";

import {
    Badge,
    Button,
    Card,
} from "@/components/ui";
import type {
    FlashcardReviewRating,
    FlashcardReviewState,
    SavedFlashcard,
} from "@/features/flashcards/model";

type FlashcardStudySessionProps = {
    courseId: number;
    cards: SavedFlashcard[];
    mode: "all" | "weak";
};

const STORAGE_PREFIX =
    "ai-study.flashcard-review-state";

function getStorageKey(courseId: number) {
    return `${STORAGE_PREFIX}:${courseId}`;
}

function readReviewState(
    courseId: number,
): Record<number, FlashcardReviewState> {
    try {
        const raw = window.localStorage.getItem(
            getStorageKey(courseId),
        );

        if (!raw) {
            return {};
        }

        return JSON.parse(raw) as Record<
            number,
            FlashcardReviewState
        >;
    } catch {
        return {};
    }
}

function writeReviewState(
    courseId: number,
    state: Record<number, FlashcardReviewState>,
) {
    window.localStorage.setItem(
        getStorageKey(courseId),
        JSON.stringify(state),
    );
}

function getNextIntervalMinutes(
    currentInterval: number | undefined,
    rating: FlashcardReviewRating,
) {
    if (rating === "AGAIN") {
        return 1;
    }

    if (rating === "GOOD") {
        return currentInterval
            ? Math.min(currentInterval * 2, 10_080)
            : 10;
    }

    return currentInterval
        ? Math.min(currentInterval * 4, 43_200)
        : 1_440;
}

function formatInterval(minutes: number) {
    if (minutes < 60) {
        return `${minutes} min`;
    }

    if (minutes < 1_440) {
        return `${Math.round(minutes / 60)} hr`;
    }

    return `${Math.round(minutes / 1_440)} day`;
}

function formatDueAt(value: string | undefined) {
    if (!value) {
        return "Not reviewed";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function sortCardsByDueState(
    cards: SavedFlashcard[],
    reviewState: Record<number, FlashcardReviewState>,
) {
    return [...cards].sort((a, b) => {
        const aDue =
            reviewState[a.id]?.dueAt ??
            "1970-01-01T00:00:00.000Z";
        const bDue =
            reviewState[b.id]?.dueAt ??
            "1970-01-01T00:00:00.000Z";

        return (
            new Date(aDue).getTime() -
            new Date(bDue).getTime()
        );
    });
}

export function FlashcardStudySession({
                                          courseId,
                                          cards,
                                          mode,
                                      }: FlashcardStudySessionProps) {
    const [
        reviewState,
        setReviewState,
    ] = useState<
        Record<number, FlashcardReviewState>
    >(() => readReviewState(courseId));

    const [
        queue,
        setQueue,
    ] = useState<SavedFlashcard[]>([]);

    const [
        completedCount,
        setCompletedCount,
    ] = useState(0);

    const [
        flipped,
        setFlipped,
    ] = useState(false);

    useEffect(() => {
        const storedState =
            readReviewState(courseId);

        setReviewState(storedState);
        setQueue(
            sortCardsByDueState(
                cards,
                storedState,
            ),
        );
        setCompletedCount(0);
        setFlipped(false);
    }, [
        cards,
        courseId,
        mode,
    ]);

    const currentCard =
        queue[0] ?? null;

    function restartSession() {
        const storedState =
            readReviewState(courseId);

        setReviewState(storedState);
        setQueue(
            sortCardsByDueState(
                cards,
                storedState,
            ),
        );
        setCompletedCount(0);
        setFlipped(false);
    }

    function handleRating(
        rating: FlashcardReviewRating,
    ) {
        if (!currentCard) {
            return;
        }

        const now = new Date();
        const existing =
            reviewState[currentCard.id];

        const intervalMinutes =
            getNextIntervalMinutes(
                existing?.intervalMinutes,
                rating,
            );

        const dueAt = new Date(
            now.getTime() +
            intervalMinutes * 60 * 1000,
        ).toISOString();

        const nextState: FlashcardReviewState = {
            flashcardId: currentCard.id,
            intervalMinutes,
            dueAt,
            lastReviewedAt: now.toISOString(),
            lastRating: rating,
            reviewCount:
                (existing?.reviewCount ?? 0) + 1,
            againCount:
                (existing?.againCount ?? 0) +
                (rating === "AGAIN" ? 1 : 0),
            goodCount:
                (existing?.goodCount ?? 0) +
                (rating === "GOOD" ? 1 : 0),
            easyCount:
                (existing?.easyCount ?? 0) +
                (rating === "EASY" ? 1 : 0),
        };

        const nextReviewState = {
            ...reviewState,
            [currentCard.id]: nextState,
        };

        setReviewState(nextReviewState);
        writeReviewState(
            courseId,
            nextReviewState,
        );

        setFlipped(false);

        setQueue((previous) => {
            const rest = previous.slice(1);

            if (rating === "AGAIN") {
                return [...rest, currentCard];
            }

            return rest;
        });

        if (rating !== "AGAIN") {
            setCompletedCount(
                (value) => value + 1,
            );
        }
    }

    if (cards.length === 0) {
        return (
            <Card className="p-6 text-center">
                <h1 className="text-lg font-semibold text-text-primary">
                    No flashcards available
                </h1>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {mode === "weak"
                        ? "No weak-topic flashcards were found. Generate weak-topic cards from quiz mistakes first."
                        : "Generate and save flashcards before starting a study session."}
                </p>
            </Card>
        );
    }

    if (!currentCard) {
        return (
            <Card className="p-6 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                    <CheckCircle2
                        className="size-6"
                        aria-hidden="true"
                    />
                </div>

                <h1 className="mt-4 text-xl font-semibold text-text-primary">
                    Session complete
                </h1>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                    You reviewed {completedCount} cards.
                    Again cards are re-queued until marked Good
                    or Easy.
                </p>

                <Button
                    className="mt-5"
                    variant="secondary"
                    onClick={restartSession}
                >
                    <RotateCcw
                        className="size-4"
                        aria-hidden="true"
                    />
                    Restart session
                </Button>
            </Card>
        );
    }

    const currentState =
        reviewState[currentCard.id];

    const progressTotal =
        completedCount + queue.length;

    const progressPercent =
        progressTotal === 0
            ? 100
            : Math.round(
                (completedCount / progressTotal) *
                100,
            );

    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <Card className="overflow-hidden">
                <div className="border-b border-line px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                Flashcard Study Mode
                            </p>

                            <h1 className="mt-2 text-2xl font-semibold text-text-primary">
                                {mode === "weak"
                                    ? "Weak topic review"
                                    : "All flashcards review"}
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                Flip the card, then rate recall
                                quality with Again, Good or Easy.
                            </p>
                        </div>

                        <Badge
                            variant={
                                mode === "weak"
                                    ? "warning"
                                    : "info"
                            }
                        >
                            {mode === "weak"
                                ? "Weak topics"
                                : "All cards"}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                        <div
                            className="h-full bg-brand-700 transition-all"
                            style={{
                                width: `${progressPercent}%`,
                            }}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary">
                        <span>
                            Completed {completedCount} · Remaining{" "}
                            {queue.length}
                        </span>

                        <span>{progressPercent}%</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setFlipped(
                                (value) => !value,
                            );
                        }}
                        className={[
                            "min-h-[360px] w-full rounded-3xl border border-line",
                            "bg-surface p-6 text-left shadow-sm",
                            "transition-colors hover:bg-surface-muted",
                            "focus-visible:outline-2 focus-visible:outline-brand-600",
                        ].join(" ")}
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="neutral">
                                {currentCard.topic}
                            </Badge>

                            <Badge variant="neutral">
                                {
                                    currentCard.difficulty
                                }
                            </Badge>

                            <Badge variant="info">
                                {flipped
                                    ? "Back"
                                    : "Front"}
                            </Badge>
                        </div>

                        <div className="mt-10 flex min-h-[220px] items-center justify-center text-center">
                            <p className="max-w-2xl whitespace-pre-wrap text-2xl font-semibold leading-10 text-text-primary">
                                {flipped
                                    ? currentCard.back
                                    : currentCard.front}
                            </p>
                        </div>

                        <p className="mt-8 text-center text-sm text-text-muted">
                            Click card to flip
                        </p>
                    </button>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <Button
                            variant="destructive"
                            disabled={!flipped}
                            onClick={() => {
                                handleRating("AGAIN");
                            }}
                        >
                            <ThumbsDown
                                className="size-4"
                                aria-hidden="true"
                            />
                            Again · 1 min
                        </Button>

                        <Button
                            variant="secondary"
                            disabled={!flipped}
                            onClick={() => {
                                handleRating("GOOD");
                            }}
                        >
                            <ThumbsUp
                                className="size-4"
                                aria-hidden="true"
                            />
                            Good ·{" "}
                            {formatInterval(
                                getNextIntervalMinutes(
                                    currentState?.intervalMinutes,
                                    "GOOD",
                                ),
                            )}
                        </Button>

                        <Button
                            disabled={!flipped}
                            onClick={() => {
                                handleRating("EASY");
                            }}
                        >
                            <Sparkles
                                className="size-4"
                                aria-hidden="true"
                            />
                            Easy ·{" "}
                            {formatInterval(
                                getNextIntervalMinutes(
                                    currentState?.intervalMinutes,
                                    "EASY",
                                ),
                            )}
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="h-fit p-4">
                <h2 className="text-sm font-semibold text-text-primary">
                    Review interval
                </h2>

                <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-xl bg-surface-muted p-3">
                        <p className="text-xs uppercase tracking-wide text-text-muted">
                            Current card
                        </p>

                        <p className="mt-1 font-medium text-text-primary">
                            #{currentCard.id}
                        </p>
                    </div>

                    <div className="rounded-xl bg-surface-muted p-3">
                        <p className="text-xs uppercase tracking-wide text-text-muted">
                            Last rating
                        </p>

                        <p className="mt-1 font-medium text-text-primary">
                            {currentState?.lastRating ??
                                "Not reviewed"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-surface-muted p-3">
                        <p className="text-xs uppercase tracking-wide text-text-muted">
                            Current interval
                        </p>

                        <p className="mt-1 font-medium text-text-primary">
                            {currentState
                                ? formatInterval(
                                    currentState.intervalMinutes,
                                )
                                : "None"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-surface-muted p-3">
                        <p className="text-xs uppercase tracking-wide text-text-muted">
                            Next due
                        </p>

                        <p className="mt-1 font-medium text-text-primary">
                            {formatDueAt(
                                currentState?.dueAt,
                            )}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}