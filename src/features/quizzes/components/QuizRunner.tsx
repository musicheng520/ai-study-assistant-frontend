import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Circle,
    HelpCircle,
    Send,
    XCircle,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";

import {
    Badge,
    Button,
    Card,
} from "@/components/ui";
import { useSubmitQuizMutation } from "@/features/quizzes/api";
import type {
    QuizDetail,
    QuizSubmitResponse,
    SavedQuizQuestion,
} from "@/features/quizzes/model";
import { cn } from "@/lib/utils/cn";
import { toApiError } from "@/lib/errors/ApiError";

type QuizRunnerProps = {
    courseId: number;
    quiz: QuizDetail;
};

function getAnswerValue(
    answers: Record<number, string>,
    questionId: number,
) {
    return answers[questionId] ?? "";
}

function getQuestionStatus(
    question: SavedQuizQuestion,
    result: QuizSubmitResponse | null,
) {
    if (!result) {
        return "unsubmitted";
    }

    const wrongAnswer =
        result.wrongAnswers.find(
            (item) =>
                item.questionId === question.id,
        );

    return wrongAnswer
        ? "wrong"
        : "correct";
}

export function QuizRunner({
                               courseId,
                               quiz,
                           }: QuizRunnerProps) {
    const submitMutation =
        useSubmitQuizMutation();

    const [
        currentIndex,
        setCurrentIndex,
    ] = useState(0);

    const [
        answers,
        setAnswers,
    ] = useState<Record<number, string>>({});

    const [
        result,
        setResult,
    ] = useState<QuizSubmitResponse | null>(
        null,
    );

    const [
        submitError,
        setSubmitError,
    ] = useState<string | null>(null);

    const currentQuestion =
        quiz.questions[currentIndex];

    const unansweredCount = useMemo(
        () =>
            quiz.questions.filter(
                (question) =>
                    !getAnswerValue(
                        answers,
                        question.id,
                    ).trim(),
            ).length,
        [
            answers,
            quiz.questions,
        ],
    );

    function updateAnswer(
        questionId: number,
        value: string,
    ) {
        if (result) {
            return;
        }

        setAnswers((previous) => ({
            ...previous,
            [questionId]: value,
        }));
    }

    async function handleSubmit() {
        setSubmitError(null);

        if (
            unansweredCount > 0 &&
            !window.confirm(
                `${unansweredCount} question(s) are unanswered. Submit anyway?`,
            )
        ) {
            return;
        }

        try {
            const response =
                await submitMutation.mutateAsync({
                    courseId,
                    quizId: quiz.id,
                    request: {
                        answers: quiz.questions.map(
                            (question) => ({
                                questionId:
                                question.id,
                                answer:
                                    getAnswerValue(
                                        answers,
                                        question.id,
                                    ).trim(),
                            }),
                        ),
                    },
                });

            setResult(response);
        } catch (error) {
            const apiError =
                toApiError(error);

            setSubmitError(apiError.message);
        }
    }

    if (!currentQuestion) {
        return (
            <Card className="p-6">
                <h1 className="text-lg font-semibold text-text-primary">
                    Quiz has no questions
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                    This saved quiz exists, but no questions
                    were returned by the backend.
                </p>
            </Card>
        );
    }

    const currentAnswer =
        getAnswerValue(
            answers,
            currentQuestion.id,
        );

    const currentStatus =
        getQuestionStatus(
            currentQuestion,
            result,
        );

    const currentWrongAnswer =
        result?.wrongAnswers.find(
            (item) =>
                item.questionId ===
                currentQuestion.id,
        );

    const isSubmitted = result !== null;

    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <Card className="overflow-hidden">
                <div className="border-b border-line px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                Quiz Runner
                            </p>

                            <h1 className="mt-2 text-2xl font-semibold text-text-primary">
                                {quiz.title}
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                Question {currentIndex + 1} of{" "}
                                {quiz.questions.length} ·{" "}
                                {quiz.difficulty} ·{" "}
                                {quiz.sourceScope}
                            </p>
                        </div>

                        {result ? (
                            <Badge
                                variant={
                                    result.score >= 70
                                        ? "success"
                                        : "warning"
                                }
                            >
                                Score {result.score}%
                            </Badge>
                        ) : (
                            <Badge variant="info">
                                In progress
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    {submitError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                            {submitError}
                        </div>
                    ) : null}

                    {result ? (
                        <div className="rounded-2xl border border-line bg-surface-muted p-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge
                                    variant={
                                        result.score >= 70
                                            ? "success"
                                            : "warning"
                                    }
                                >
                                    {result.correctCount}/
                                    {
                                        result.totalQuestions
                                    }{" "}
                                    correct
                                </Badge>

                                <Badge variant="neutral">
                                    Attempt #
                                    {result.attemptId}
                                </Badge>

                                <Badge variant="neutral">
                                    {
                                        result.wrongAnswers
                                            .length
                                    }{" "}
                                    wrong
                                </Badge>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-text-secondary">
                                The backend has graded this
                                attempt and recorded wrong
                                answers for progress tracking.
                            </p>
                        </div>
                    ) : null}

                    <article className="rounded-2xl border border-line bg-surface p-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="neutral">
                                Q{currentIndex + 1}
                            </Badge>

                            <Badge
                                variant={
                                    currentQuestion.questionType ===
                                    "MCQ"
                                        ? "info"
                                        : "neutral"
                                }
                            >
                                {
                                    currentQuestion.questionType
                                }
                            </Badge>

                            <Badge variant="neutral">
                                {currentQuestion.topic}
                            </Badge>

                            {currentStatus ===
                            "correct" ? (
                                <Badge variant="success">
                                    Correct
                                </Badge>
                            ) : null}

                            {currentStatus === "wrong" ? (
                                <Badge variant="warning">
                                    Wrong
                                </Badge>
                            ) : null}
                        </div>

                        <h2 className="mt-4 text-lg font-semibold leading-7 text-text-primary">
                            {
                                currentQuestion.questionText
                            }
                        </h2>

                        {currentQuestion.questionType ===
                        "MCQ" ? (
                            <fieldset
                                className="mt-5 space-y-3"
                                disabled={isSubmitted}
                            >
                                <legend className="sr-only">
                                    Choose one answer
                                </legend>

                                {currentQuestion.options.map(
                                    (
                                        option,
                                        optionIndex,
                                    ) => {
                                        const checked =
                                            currentAnswer ===
                                            option;

                                        const isCorrectOption =
                                            isSubmitted &&
                                            option ===
                                            currentQuestion.correctAnswer;

                                        const isChosenWrong =
                                            isSubmitted &&
                                            checked &&
                                            option !==
                                            currentQuestion.correctAnswer;

                                        return (
                                            <label
                                                key={`${currentQuestion.id}-${option}-${optionIndex}`}
                                                className={cn(
                                                    [
                                                        "flex cursor-pointer items-start gap-3",
                                                        "rounded-xl border p-3",
                                                        "transition-colors",
                                                    ],
                                                    checked
                                                        ? "border-brand-300 bg-brand-50"
                                                        : "border-line bg-surface hover:bg-surface-muted",
                                                    isCorrectOption
                                                        ? "border-emerald-300 bg-emerald-50"
                                                        : "",
                                                    isChosenWrong
                                                        ? "border-red-300 bg-red-50"
                                                        : "",
                                                    isSubmitted
                                                        ? "cursor-default"
                                                        : "",
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuestion.id}`}
                                                    value={
                                                        option
                                                    }
                                                    checked={
                                                        checked
                                                    }
                                                    onChange={() => {
                                                        updateAnswer(
                                                            currentQuestion.id,
                                                            option,
                                                        );
                                                    }}
                                                    className="mt-1"
                                                />

                                                <span className="text-sm leading-6 text-text-primary">
                                                    {option}
                                                </span>
                                            </label>
                                        );
                                    },
                                )}
                            </fieldset>
                        ) : (
                            <div className="mt-5">
                                <label
                                    htmlFor={`answer-${currentQuestion.id}`}
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Your answer
                                </label>

                                <textarea
                                    id={`answer-${currentQuestion.id}`}
                                    value={currentAnswer}
                                    onChange={(event) => {
                                        updateAnswer(
                                            currentQuestion.id,
                                            event.target
                                                .value,
                                        );
                                    }}
                                    disabled={isSubmitted}
                                    rows={6}
                                    className="mt-2 w-full resize-none rounded-xl border border-line bg-surface px-3 py-2 text-sm leading-6 text-text-primary placeholder:text-text-muted focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-70"
                                    placeholder="Write your answer here..."
                                />
                            </div>
                        )}

                        {isSubmitted ? (
                            <div className="mt-5 space-y-3">
                                <div
                                    className={cn(
                                        "rounded-xl border p-4",
                                        currentStatus ===
                                        "correct"
                                            ? "border-emerald-200 bg-emerald-50"
                                            : "border-red-200 bg-red-50",
                                    )}
                                >
                                    <p className="flex items-center gap-2 text-sm font-semibold">
                                        {currentStatus ===
                                        "correct" ? (
                                            <CheckCircle2
                                                className="size-4 text-emerald-700"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <XCircle
                                                className="size-4 text-red-700"
                                                aria-hidden="true"
                                            />
                                        )}

                                        <span
                                            className={
                                                currentStatus ===
                                                "correct"
                                                    ? "text-emerald-900"
                                                    : "text-red-900"
                                            }
                                        >
                                            Correct answer
                                        </span>
                                    </p>

                                    <p
                                        className={cn(
                                            "mt-2 text-sm leading-6",
                                            currentStatus ===
                                            "correct"
                                                ? "text-emerald-900"
                                                : "text-red-900",
                                        )}
                                    >
                                        {
                                            currentQuestion.correctAnswer
                                        }
                                    </p>
                                </div>

                                <div className="rounded-xl border border-line bg-surface-muted p-4">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                                        <HelpCircle
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Explanation
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        {currentWrongAnswer?.explanation ||
                                            currentQuestion.explanation ||
                                            "No explanation was provided."}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </article>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button
                            variant="secondary"
                            disabled={
                                currentIndex === 0
                            }
                            onClick={() => {
                                setCurrentIndex(
                                    (value) =>
                                        Math.max(
                                            0,
                                            value - 1,
                                        ),
                                );
                            }}
                        >
                            <ArrowLeft
                                className="size-4"
                                aria-hidden="true"
                            />
                            Previous
                        </Button>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="secondary"
                                disabled={
                                    currentIndex ===
                                    quiz.questions.length -
                                    1
                                }
                                onClick={() => {
                                    setCurrentIndex(
                                        (value) =>
                                            Math.min(
                                                quiz.questions
                                                    .length - 1,
                                                value + 1,
                                            ),
                                    );
                                }}
                            >
                                Next
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </Button>

                            <Button
                                disabled={
                                    isSubmitted ||
                                    submitMutation.isPending
                                }
                                onClick={() => {
                                    void handleSubmit();
                                }}
                            >
                                <Send
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                {submitMutation.isPending
                                    ? "Submitting..."
                                    : "Submit quiz"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="h-fit p-4">
                <h2 className="text-sm font-semibold text-text-primary">
                    Questions
                </h2>

                <p className="mt-1 text-xs text-text-muted">
                    {unansweredCount} unanswered
                </p>

                <div className="mt-4 grid grid-cols-5 gap-2 lg:grid-cols-4">
                    {quiz.questions.map(
                        (question, index) => {
                            const value =
                                getAnswerValue(
                                    answers,
                                    question.id,
                                );

                            const status =
                                getQuestionStatus(
                                    question,
                                    result,
                                );

                            return (
                                <button
                                    key={question.id}
                                    type="button"
                                    onClick={() => {
                                        setCurrentIndex(
                                            index,
                                        );
                                    }}
                                    className={cn(
                                        [
                                            "grid size-10 place-items-center rounded-lg border",
                                            "text-sm font-medium transition-colors",
                                            "focus-visible:outline-2",
                                            "focus-visible:outline-brand-600",
                                        ],
                                        index ===
                                        currentIndex
                                            ? "border-brand-400 bg-brand-50 text-brand-900"
                                            : "border-line bg-surface text-text-secondary hover:bg-surface-muted",
                                        status === "correct"
                                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                            : "",
                                        status === "wrong"
                                            ? "border-red-300 bg-red-50 text-red-900"
                                            : "",
                                    )}
                                    aria-label={`Go to question ${index + 1}`}
                                >
                                    {result ? (
                                        status ===
                                        "correct" ? (
                                            <CheckCircle2
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <XCircle
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        )
                                    ) : value.trim() ? (
                                        <CheckCircle2
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Circle
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            );
                        },
                    )}
                </div>
            </Card>
        </div>
    );
}