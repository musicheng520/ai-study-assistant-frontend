import {
    Check,
    Layers,
    RefreshCcw,
    Save,
    Sparkles,
} from "lucide-react";
import {
    useState,
} from "react";

import {
    Badge,
    Button,
    Card,
} from "@/components/ui";
import {
    useGenerateCourseFlashcardsMutation,
    useGenerateWeakTopicFlashcardsMutation,
    useSaveFlashcardsDraftMutation,
} from "@/features/flashcards";
import type {
    FlashcardDifficulty,
    FlashcardGenerateResponse,
} from "@/features/flashcards";
import { toApiError } from "@/lib/errors/ApiError";

type FlashcardGeneratorPanelProps = {
    courseId: number;
};

type GeneratorMode =
    | "COURSE"
    | "WEAK_TOPICS";

const difficultyOptions: FlashcardDifficulty[] = [
    "EASY",
    "MEDIUM",
    "HARD",
];

export function FlashcardGeneratorPanel({
                                            courseId,
                                        }: FlashcardGeneratorPanelProps) {
    const generateCourseMutation =
        useGenerateCourseFlashcardsMutation();

    const generateWeakTopicMutation =
        useGenerateWeakTopicFlashcardsMutation();

    const saveMutation =
        useSaveFlashcardsDraftMutation();

    const [
        mode,
        setMode,
    ] = useState<GeneratorMode>("COURSE");

    const [
        count,
        setCount,
    ] = useState(4);

    const [
        topK,
        setTopK,
    ] = useState(3);

    const [
        topicLimit,
        setTopicLimit,
    ] = useState(3);

    const [
        cardsPerTopic,
        setCardsPerTopic,
    ] = useState(2);

    const [
        difficulty,
        setDifficulty,
    ] = useState<FlashcardDifficulty>("MEDIUM");

    const [
        retrievalQuery,
        setRetrievalQuery,
    ] = useState("");

    const [
        draft,
        setDraft,
    ] = useState<FlashcardGenerateResponse | null>(
        null,
    );

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        savedCount,
        setSavedCount,
    ] = useState<number | null>(null);

    async function handleGenerate() {
        setErrorMessage(null);
        setSavedCount(null);

        try {
            const response =
                mode === "COURSE"
                    ? await generateCourseMutation.mutateAsync({
                        courseId,
                        request: {
                            count,
                            topK,
                            difficulty,
                            retrievalQuery:
                                retrievalQuery.trim() ||
                                undefined,
                        },
                    })
                    : await generateWeakTopicMutation.mutateAsync({
                        courseId,
                        request: {
                            topicLimit,
                            cardsPerTopic,
                            difficulty,
                            topK:
                                Math.max(
                                    topK,
                                    topicLimit,
                                ),
                        },
                    });

            setDraft(response);
        } catch (error) {
            const apiError =
                toApiError(error);

            setErrorMessage(apiError.message);
        }
    }

    async function handleSaveDraft() {
        if (!draft) {
            return;
        }

        setErrorMessage(null);

        try {
            const response =
                await saveMutation.mutateAsync({
                    draftKey: draft.draftKey,
                });

            setSavedCount(response.savedCount);
        } catch (error) {
            const apiError =
                toApiError(error);

            setErrorMessage(apiError.message);
        }
    }

    const isGenerating =
        generateCourseMutation.isPending ||
        generateWeakTopicMutation.isPending;

    const isSaving =
        saveMutation.isPending;

    return (
        <Card className="overflow-hidden">
            <div className="border-b border-line px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                            <Layers
                                className="size-4"
                                aria-hidden="true"
                            />
                            Flashcard generator
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-text-primary">
                            Generate flashcard draft
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                            Generate revision cards from course
                            materials or from weak topics detected
                            from quiz mistakes.
                        </p>
                    </div>

                    <Badge variant="info">
                        M63.3
                    </Badge>
                </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="flashcard-mode"
                            className="text-sm font-medium text-text-primary"
                        >
                            Source
                        </label>

                        <select
                            id="flashcard-mode"
                            value={mode}
                            onChange={(event) => {
                                setMode(
                                    event.target
                                        .value as GeneratorMode,
                                );
                                setDraft(null);
                                setSavedCount(null);
                                setErrorMessage(null);
                            }}
                            disabled={
                                isGenerating || isSaving
                            }
                            className="mt-2 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <option value="COURSE">
                                Course documents
                            </option>
                            <option value="WEAK_TOPICS">
                                Weak topics
                            </option>
                        </select>
                    </div>

                    {mode === "COURSE" ? (
                        <>
                            <div>
                                <label
                                    htmlFor="flashcard-count"
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Card count
                                </label>

                                <select
                                    id="flashcard-count"
                                    value={count}
                                    onChange={(event) => {
                                        setCount(
                                            Number(
                                                event.target
                                                    .value,
                                            ),
                                        );
                                    }}
                                    disabled={
                                        isGenerating ||
                                        isSaving
                                    }
                                    className="mt-2 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value={2}>2</option>
                                    <option value={4}>4</option>
                                    <option value={6}>6</option>
                                    <option value={8}>8</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="flashcard-query"
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Focus query
                                </label>

                                <textarea
                                    id="flashcard-query"
                                    value={retrievalQuery}
                                    onChange={(event) => {
                                        setRetrievalQuery(
                                            event.target
                                                .value,
                                        );
                                    }}
                                    disabled={
                                        isGenerating ||
                                        isSaving
                                    }
                                    rows={4}
                                    placeholder="Optional. Example: focus on definitions and exam concepts."
                                    className="mt-2 w-full resize-none rounded-xl border border-line bg-surface px-3 py-2 text-sm leading-6 text-text-primary placeholder:text-text-muted focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    htmlFor="flashcard-topic-limit"
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Topics
                                </label>

                                <select
                                    id="flashcard-topic-limit"
                                    value={topicLimit}
                                    onChange={(event) => {
                                        setTopicLimit(
                                            Number(
                                                event.target
                                                    .value,
                                            ),
                                        );
                                    }}
                                    disabled={
                                        isGenerating ||
                                        isSaving
                                    }
                                    className="mt-2 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={5}>5</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="flashcard-cards-per-topic"
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Cards/topic
                                </label>

                                <select
                                    id="flashcard-cards-per-topic"
                                    value={cardsPerTopic}
                                    onChange={(event) => {
                                        setCardsPerTopic(
                                            Number(
                                                event.target
                                                    .value,
                                            ),
                                        );
                                    }}
                                    disabled={
                                        isGenerating ||
                                        isSaving
                                    }
                                    className="mt-2 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={5}>5</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="flashcard-difficulty"
                            className="text-sm font-medium text-text-primary"
                        >
                            Difficulty
                        </label>

                        <select
                            id="flashcard-difficulty"
                            value={difficulty}
                            onChange={(event) => {
                                setDifficulty(
                                    event.target
                                        .value as FlashcardDifficulty,
                                );
                            }}
                            disabled={
                                isGenerating || isSaving
                            }
                            className="mt-2 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {difficultyOptions.map(
                                (option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="flashcard-top-k"
                            className="text-sm font-medium text-text-primary"
                        >
                            Retrieved chunks
                        </label>

                        <select
                            id="flashcard-top-k"
                            value={topK}
                            onChange={(event) => {
                                setTopK(
                                    Number(
                                        event.target.value,
                                    ),
                                );
                            }}
                            disabled={
                                isGenerating || isSaving
                            }
                            className="mt-2 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <option value={1}>1 chunk</option>
                            <option value={3}>3 chunks</option>
                            <option value={5}>5 chunks</option>
                            <option value={8}>8 chunks</option>
                            <option value={10}>10 chunks</option>
                        </select>
                    </div>

                    {errorMessage ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                            {errorMessage}
                        </div>
                    ) : null}

                    {savedCount !== null ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
                            Saved {savedCount} flashcards.
                        </div>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                        <Button
                            disabled={
                                isGenerating || isSaving
                            }
                            onClick={() => {
                                void handleGenerate();
                            }}
                        >
                            {isGenerating ? (
                                <RefreshCcw
                                    className="size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Sparkles
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            )}

                            {isGenerating
                                ? "Generating..."
                                : draft
                                    ? "Regenerate"
                                    : "Generate"}
                        </Button>

                        <Button
                            variant="secondary"
                            disabled={
                                !draft ||
                                isGenerating ||
                                isSaving ||
                                savedCount !== null
                            }
                            onClick={() => {
                                void handleSaveDraft();
                            }}
                        >
                            {savedCount !== null ? (
                                <Check
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Save
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            )}

                            {isSaving
                                ? "Saving..."
                                : savedCount !== null
                                    ? "Saved"
                                    : "Save cards"}
                        </Button>
                    </div>
                </div>

                <div className="min-w-0">
                    {!draft ? (
                        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-line bg-surface-muted p-6 text-center">
                            <div className="max-w-md">
                                <div className="mx-auto grid size-12 place-items-center rounded-full bg-ai-50 text-ai-700">
                                    <Layers
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-text-primary">
                                    No flashcard draft yet
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    Generate course cards or weak
                                    topic cards. The draft will
                                    appear here before saving.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5 rounded-2xl border border-line bg-surface p-5">
                            <div>
                                <Badge variant="warning">
                                    Unsaved Draft
                                </Badge>

                                <h3 className="mt-3 text-lg font-semibold text-text-primary">
                                    {draft.title}
                                </h3>

                                <p className="mt-1 text-xs text-text-muted">
                                    {draft.count} cards ·{" "}
                                    {draft.difficulty} ·{" "}
                                    {draft.sourceType ??
                                        draft.sourceScope ??
                                        mode}
                                </p>
                            </div>

                            {draft.topics.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {draft.topics.map(
                                        (topic) => (
                                            <Badge
                                                key={topic}
                                                variant="neutral"
                                            >
                                                {topic}
                                            </Badge>
                                        ),
                                    )}
                                </div>
                            ) : null}

                            <div className="grid gap-4 md:grid-cols-2">
                                {draft.cards.map(
                                    (card, index) => (
                                        <article
                                            key={`${card.front}-${index}`}
                                            className="rounded-2xl border border-line p-4"
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="neutral">
                                                    Card{" "}
                                                    {index + 1}
                                                </Badge>

                                                <Badge variant="info">
                                                    {card.topic}
                                                </Badge>
                                            </div>

                                            <h4 className="mt-3 text-sm font-semibold leading-6 text-text-primary">
                                                {card.front}
                                            </h4>

                                            <p className="mt-3 rounded-xl bg-surface-muted p-3 text-sm leading-6 text-text-secondary">
                                                {card.back}
                                            </p>
                                        </article>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}