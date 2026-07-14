import {
    ChartNoAxesCombined,
    TrendingUp,
} from "lucide-react";

import { PageHeader,
         PageSkeleton,
} from "@/components/layout";
import {
    Badge,
    Card,
    CardContent,
} from "@/components/ui";

export function OverallProgressPage() {

    const showSkeleton = false;

    if (showSkeleton) {
        return <PageSkeleton />;
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl">
                <PageHeader
                    eyebrow={
                        <Badge variant="ai">
                            <TrendingUp
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Learning insights
                        </Badge>
                    }
                    title="Overall progress"
                    description="Review learning activity, quiz performance and study streaks across your courses."
                />

                <Card className="mt-8 border-dashed shadow-none">
                    <CardContent className="py-12 text-center sm:py-16">
                        <div
                            className="mx-auto grid size-12 place-items-center rounded-xl bg-ai-50 text-ai-700"
                            aria-hidden="true"
                        >
                            <ChartNoAxesCombined className="size-6" />
                        </div>

                        <h2 className="mt-5 text-base font-semibold text-text-primary">
                            Progress data will appear here
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                            The current page verifies route navigation.
                            Real progress metrics will later come from
                            the Spring Boot progress APIs.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}