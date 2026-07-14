import {
    BookOpen,
    Sparkles,
    Trash2,
    Upload,
} from "lucide-react";

import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Skeleton,
} from "@/components/ui";

export function DesignSystemPreview() {
    return (
        <section
            className="mt-8"
            aria-labelledby="design-system-title"
        >
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-brand-700">
                        M57 Design System
                    </p>

                    <h2
                        id="design-system-title"
                        className="mt-1 text-xl font-semibold tracking-tight text-text-primary"
                    >
                        Shared interface components
                    </h2>
                </div>

                <Badge variant="ai">
                    <Sparkles
                        className="size-3.5"
                        aria-hidden="true"
                    />
                    AI Workspace
                </Badge>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <CardTitle>
                                    Machine Learning
                                </CardTitle>

                                <CardDescription>
                                    CS501 · Course workspace
                                </CardDescription>
                            </div>

                            <Badge variant="success">
                                READY
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-start gap-3 rounded-xl bg-canvas p-4">
                            <BookOpen
                                className="mt-0.5 size-5 shrink-0 text-brand-700"
                                aria-hidden="true"
                            />

                            <div>
                                <p className="text-sm font-medium text-text-primary">
                                    3 documents available
                                </p>

                                <p className="mt-1 text-sm leading-6 text-text-secondary">
                                    Ask questions or generate study
                                    materials from the ready documents.
                                </p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex-wrap">
                        <Button size="sm">
                            Open course
                        </Button>

                        <Button
                            size="sm"
                            variant="secondary"
                        >
                            <Upload
                                className="size-4"
                                aria-hidden="true"
                            />
                            Upload
                        </Button>

                        <Button
                            size="sm"
                            variant="ai"
                        >
                            <Sparkles
                                className="size-4"
                                aria-hidden="true"
                            />
                            Generate
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Component states
                        </CardTitle>

                        <CardDescription>
                            Status, action and loading variants.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="flex flex-wrap gap-2">
                            <Badge>Neutral</Badge>
                            <Badge variant="info">Info</Badge>
                            <Badge variant="success">READY</Badge>
                            <Badge variant="warning">
                                PROCESSING
                            </Badge>
                            <Badge variant="destructive">
                                FAILED
                            </Badge>
                            <Badge variant="ai">
                                AI Draft
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button size="sm">
                                Primary
                            </Button>

                            <Button
                                size="sm"
                                variant="secondary"
                            >
                                Secondary
                            </Button>

                            <Button
                                size="sm"
                                variant="ghost"
                            >
                                Ghost
                            </Button>

                            <Button
                                size="sm"
                                variant="destructive"
                            >
                                <Trash2
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Delete
                            </Button>

                            <Button
                                disabled
                                size="sm"
                            >
                                Disabled
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}