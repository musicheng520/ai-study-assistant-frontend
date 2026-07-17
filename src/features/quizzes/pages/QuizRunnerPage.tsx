import {
    ArrowLeft,
    RefreshCcw,
} from "lucide-react";
import {
    Link,
    useParams,
} from "react-router";

import {
    Button,
    Card,
    buttonVariants,
} from "@/components/ui";
import { useCourseContext } from "@/features/courses/context/course-context";
import { useQuizDetailQuery } from "@/features/quizzes/api";

import { QuizRunner } from "../components/QuizRunner";

function parseRouteNumber(
    value: string | undefined,
): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);

    if (
        !Number.isInteger(parsed) ||
        parsed <= 0
    ) {
        return null;
    }

    return parsed;
}

export function QuizRunnerPage() {
    const params = useParams();
    const { course } = useCourseContext();

    const quizId =
        parseRouteNumber(params.quizId);

    const quizQuery =
        useQuizDetailQuery(quizId);

    if (quizId === null) {
        return (
            <Card className="p-6">
                <h1 className="text-lg font-semibold text-text-primary">
                    Invalid quiz route
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                    The quiz ID in this URL is not valid.
                </p>

                <Link
                    to={`/courses/${course.id}/study`}
                    className={buttonVariants({
                        variant: "secondary",
                        size: "sm",
                    })}
                >
                    <ArrowLeft
                        className="size-4"
                        aria-hidden="true"
                    />
                    Back to Study
                </Link>
            </Card>
        );
    }

    if (quizQuery.isPending) {
        return (
            <Card className="p-6">
                <p className="text-sm text-text-secondary">
                    Loading quiz...
                </p>
            </Card>
        );
    }

    if (quizQuery.isError) {
        return (
            <Card className="p-6">
                <h1 className="text-lg font-semibold text-text-primary">
                    Failed to load quiz
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                    The selected quiz could not be loaded.
                </p>

                <Button
                    className="mt-4"
                    variant="secondary"
                    onClick={() => {
                        void quizQuery.refetch();
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

    if (!quizQuery.data) {
        return (
            <Card className="p-6">
                <h1 className="text-lg font-semibold text-text-primary">
                    Quiz not found
                </h1>
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

            <QuizRunner
                courseId={course.id}
                quiz={quizQuery.data}
            />
        </div>
    );
}