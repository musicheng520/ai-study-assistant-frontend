import {
    Calendar,
    ListChecks,
    PlayCircle,
    RefreshCcw,
} from "lucide-react";
import {
    Link,
} from "react-router";

import {
    Badge,
    Button,
    Card,
    buttonVariants,
} from "@/components/ui";
import { useCourseQuizzesQuery } from "@/features/quizzes";

type SavedQuizzesPanelProps = {
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

export function SavedQuizzesPanel({
                                      courseId,
                                  }: SavedQuizzesPanelProps) {
    const quizzesQuery =
        useCourseQuizzesQuery(courseId);

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
                <div>
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                        <ListChecks
                            className="size-4"
                            aria-hidden="true"
                        />
                        Saved quizzes
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-text-primary">
                        Quiz library
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        Open a saved quiz, answer questions, and
                        submit it for backend grading.
                    </p>
                </div>

                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        void quizzesQuery.refetch();
                    }}
                >
                    <RefreshCcw
                        className="size-4"
                        aria-hidden="true"
                    />
                    Refresh
                </Button>
            </div>

            <div className="p-5 sm:p-6">
                {quizzesQuery.isPending ? (
                    <div className="space-y-3">
                        {Array.from({
                            length: 3,
                        }).map((_, index) => (
                            <div
                                key={`quiz-skeleton-${index}`}
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

                {quizzesQuery.isError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-900">
                            Failed to load saved quizzes
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-800">
                            Try refreshing the quiz library.
                        </p>
                    </div>
                ) : null}

                {!quizzesQuery.isPending &&
                !quizzesQuery.isError &&
                quizzesQuery.data?.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line bg-surface-muted p-6 text-center">
                        <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface text-text-muted">
                            <ListChecks
                                className="size-5"
                                aria-hidden="true"
                            />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-text-primary">
                            No saved quizzes yet
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            Generate a draft quiz above, then
                            save it to build your quiz library.
                        </p>
                    </div>
                ) : null}

                {!quizzesQuery.isPending &&
                !quizzesQuery.isError &&
                quizzesQuery.data &&
                quizzesQuery.data.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {quizzesQuery.data.map(
                            (quiz) => (
                                <article
                                    key={quiz.id}
                                    className="rounded-2xl border border-line bg-surface p-4"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="info">
                                            {
                                                quiz.questionCount
                                            }{" "}
                                            questions
                                        </Badge>

                                        <Badge variant="neutral">
                                            {
                                                quiz.difficulty
                                            }
                                        </Badge>

                                        <Badge variant="neutral">
                                            {
                                                quiz.sourceScope
                                            }
                                        </Badge>
                                    </div>

                                    <h3 className="mt-3 text-base font-semibold text-text-primary">
                                        {quiz.title}
                                    </h3>

                                    <p className="mt-3 flex items-center gap-1 text-xs text-text-muted">
                                        <Calendar
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                        {formatDate(
                                            quiz.createdAt,
                                        )}
                                    </p>

                                    <div className="mt-4">
                                        <Link
                                            to={`/courses/${courseId}/quizzes/${quiz.id}`}
                                            className={buttonVariants({
                                                variant:
                                                    "secondary",
                                                size: "sm",
                                            })}
                                        >
                                            <PlayCircle
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                            Start quiz
                                        </Link>
                                    </div>
                                </article>
                            ),
                        )}
                    </div>
                ) : null}
            </div>
        </Card>
    );
}