import {
    Card,
    CardContent,
    CardHeader,
    Skeleton,
} from "@/components/ui";

export function CoursesPageSkeleton() {
    return (
        <main
            className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8"
            aria-busy="true"
            aria-label="Loading courses"
        >
            <section className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                    <div>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="mt-4 h-9 w-44" />
                        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
                    </div>

                    <Skeleton className="h-11 w-36" />
                </div>

                <Skeleton className="mt-8 h-11 w-full max-w-md" />

                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({
                        length: 6,
                    }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="mt-3 h-6 w-2/3" />
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="mt-5 h-2 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    );
}