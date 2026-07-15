import {
    Card,
    CardContent,
    CardHeader,
    Skeleton,
} from "@/components/ui";

export function DocumentsListSkeleton() {
    return (
        <div
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            aria-busy="true"
            aria-label="Loading course documents"
        >
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <Card key={index}>
                    <CardHeader>
                        <div className="flex gap-3">
                            <Skeleton className="size-11 shrink-0 rounded-xl" />

                            <div className="flex-1">
                                <Skeleton className="h-5 w-4/5" />
                                <Skeleton className="mt-3 h-5 w-1/2" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-16" />
                            <Skeleton className="h-16" />
                            <Skeleton className="h-16" />
                            <Skeleton className="h-16" />
                        </div>

                        <Skeleton className="mt-4 h-20" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}