import {
    Card,
    CardContent,
    CardHeader,
    Skeleton,
} from "@/components/ui";

export function CourseOverviewSkeleton() {
    return (
        <div
            className="space-y-6"
            aria-busy="true"
            aria-label="Loading course overview"
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({
                    length: 4,
                }).map((_, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>

                        <CardContent>
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="mt-3 h-4 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-36" />
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-36" />
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}