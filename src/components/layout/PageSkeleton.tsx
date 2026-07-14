import {
    Card,
    CardContent,
    CardHeader,
    Skeleton,
} from "@/components/ui";

type PageSkeletonProps = {
    cardCount?: number;
};

export function PageSkeleton({
                                 cardCount = 3,
                             }: PageSkeletonProps) {
    return (
        <main
            className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8"
            aria-busy="true"
            aria-label="Loading page content"
        >
            <section className="mx-auto max-w-6xl">
                <header>
                    <Skeleton className="h-6 w-32" />

                    <Skeleton className="mt-4 h-9 w-64 max-w-full" />

                    <div className="mt-3 space-y-2">
                        <Skeleton className="h-4 w-full max-w-xl" />
                        <Skeleton className="h-4 w-4/5 max-w-lg" />
                    </div>
                </header>

                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({
                        length: cardCount,
                    }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-1/3" />
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    );
}