import {
    Check,
    HelpCircle,
    ListChecks,
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
    useGenerateCourseQuizMutation,
    useSaveQuizDraftMutation,
} from "@/features/quizzes";
import type {
    QuizDifficulty,
    QuizGenerateResponse,
} from "@/features/quizzes";
import { toApiError } from "@/lib/errors/ApiError";

type QuizGeneratorPanelProps = {
    courseId: number;
};

const difficultyOptions: QuizDifficulty[] = [
    "EASY",
    "MEDIUM",
    "HARD",
];

export function QuizGeneratorPanel({
                                       courseId,
                                   }: QuizGeneratorPanelProps) {
    const generateMutation =
        useGenerateCourseQuizMutation();

    const saveMutation =
        useSaveQuizDraftMutation();

    const [
        topK,
        setTopK,
    ] = useState(3);

    const [
        mcqCount,
        setMcqCount,
    ] = useState(2);

    const [
        shortAnswerCount,
        setShortAnswerCount,
    ] = useState(1);

    const [
        difficulty,
        setDifficulty,
    ] = useState<QuizDifficulty>("MEDIUM");

    const [
        retrievalQuery,
        setRetrievalQuery,
    ] = useState("");

    const [
        draft,
        setDraft,
    ] = useState<QuizGenerateResponse | null>(
        null,
    );

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        savedQuizId,
        setSavedQuizId,
    ] = useState<number | null>(null);

    async function handleGenerate() {
        setErrorMessage(null);
        setSavedQuizId(null);

        try {
            const response =
                await generateMutation.mutateAsync({
                    courseId,
                    request: {
                        topK,
                        retrievalQuery:
                            retrievalQuery.trim() ||
                            undefined,
                        mcqCount,
                        shortAnswerCount,
                        difficulty,
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

            setSavedQuizId(response.quizId);
        } catch (error) {
            const apiError =
                toApiError(error);

            setErrorMessage(apiError.message);
        }
    }

    const isGenerating =
        generateMutation.isPending;

    const isSaving =
        saveMutation.isPending;

    return (
        <Card className="overflow-hidden">
            <div className="border-b border-line px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                            <ListChecks
                                className="size-4"
                                aria-hidden="true"
                            />
                            Quiz generator
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-text-primary">
                            Generate quiz draft
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                            Generate MCQ and short-answer
                            questions from READY course
                            documents. The quiz is temporary
                            until you save it.
                        </p>
                    </div>

                    <Badge variant="info">
                        M63
                    </Badge>
                </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                htmlFor="quiz-mcq-count"
                                className="text-sm font-medium text-text-primary"
                            >
                                MCQ
                            </label>

                            <select
                                id="quiz-mcq-count"
                                value={mcqCount}
                                onChange={(event) => {
                                    setMcqCount(
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
                                <option value={0}>0</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={5}>5</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="quiz-short-count"
                                className="text-sm font-medium text-text-primary"
                            >
                                Short answer
                            </label>

                            <select
                                id="quiz-short-count"
                                value={shortAnswerCount}
                                onChange={(event) => {
                                    setShortAnswerCount(
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
                                <option value={0}>0</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={5}>5</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="quiz-difficulty"
                            className="text-sm font-medium text-text-primary"
                        >
                            Difficulty
                        </label>

                        <select
                            id="quiz-difficulty"
                            value={difficulty}
                            onChange={(event) => {
                                setDifficulty(
                                    event.target
                                        .value as QuizDifficulty,
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
                            htmlFor="quiz-top-k"
                            className="text-sm font-medium text-text-primary"
                        >
                            Retrieved chunks
                        </label>

                        <select
                            id="quiz-top-k"
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
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="quiz-query"
                            className="text-sm font-medium text-text-primary"
                        >
                            Focus query
                        </label>

                        <textarea
                            id="quiz-query"
                            value={retrievalQuery}
                            onChange={(event) => {
                                setRetrievalQuery(
                                    event.target.value,
                                );
                            }}
                            disabled={
                                isGenerating || isSaving
                            }
                            rows={4}
                            placeholder="Optional. Example: focus on Spring AI RAG workflow."
                            className="mt-2 w-full resize-none rounded-xl border border-line bg-surface px-3 py-2 text-sm leading-6 text-text-primary placeholder:text-text-muted focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>

                    {errorMessage ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                            {errorMessage}
                        </div>
                    ) : null}

                    {savedQuizId ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
                            Quiz saved. ID: {savedQuizId}
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
                                savedQuizId !== null
                            }
                            onClick={() => {
                                void handleSaveDraft();
                            }}
                        >
                            {savedQuizId ? (
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
                                : savedQuizId
                                    ? "Saved"
                                    : "Save quiz"}
                        </Button>
                    </div>
                </div>

                <div className="min-w-0">
                    {!draft ? (
                        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-line bg-surface-muted p-6 text-center">
                            <div className="max-w-md">
                                <div className="mx-auto grid size-12 place-items-center rounded-full bg-ai-50 text-ai-700">
                                    <HelpCircle
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-text-primary">
                                    No quiz draft yet
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    Configure the quiz and
                                    generate a draft. Questions,
                                    answers and explanations will
                                    appear here before saving.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5 rounded-2xl border border-line bg-surface p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <Badge variant="warning">
                                        Unsaved Draft
                                    </Badge>

                                    <h3 className="mt-3 text-lg font-semibold text-text-primary">
                                        {draft.title}
                                    </h3>

                                    <p className="mt-1 text-xs text-text-muted">
                                        {draft.questionCount}{" "}
                                        questions ·{" "}
                                        {draft.difficulty} ·{" "}
                                        {draft.sourceScope}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {draft.questions.map(
                                    (
                                        question,
                                        index,
                                    ) => (
                                        <article
                                            key={`${question.questionType}-${index}-${question.questionText}`}
                                            className="rounded-2xl border border-line p-4"
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="neutral">
                                                    Q
                                                    {index +
                                                        1}
                                                </Badge>

                                                <Badge
                                                    variant={
                                                        question.questionType ===
                                                        "MCQ"
                                                            ? "info"
                                                            : "neutral"
                                                    }
                                                >
                                                    {
                                                        question.questionType
                                                    }
                                                </Badge>

                                                <Badge variant="neutral">
                                                    {
                                                        question.topic
                                                    }
                                                </Badge>
                                            </div>

                                            <h4 className="mt-3 text-sm font-semibold leading-6 text-text-primary">
                                                {
                                                    question.questionText
                                                }
                                            </h4>

                                            {question.options.length >
                                            0 ? (
                                                <ul className="mt-3 space-y-2">
                                                    {question.options.map(
                                                        (
                                                            option,
                                                        ) => (
                                                            <li
                                                                key={
                                                                    option
                                                                }
                                                                className="rounded-lg border border-line bg-surface-muted px-3 py-2 text-sm text-text-secondary"
                                                            >
                                                                {
                                                                    option
                                                                }
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : null}

                                            <div className="mt-4 rounded-xl bg-emerald-50 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                                                    Answer
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-emerald-900">
                                                    {
                                                        question.correctAnswer
                                                    }
                                                </p>
                                            </div>

                                            {question.explanation ? (
                                                <p className="mt-3 text-sm leading-6 text-text-secondary">
                                                    {
                                                        question.explanation
                                                    }
                                                </p>
                                            ) : null}
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