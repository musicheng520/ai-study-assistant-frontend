import {
    BookOpenText,
    Plus,
} from "lucide-react";

import { PageHeader } from "@/components/layout";
import {
    Badge,
    Button,
    Card,
    CardContent,
} from "@/components/ui";

export function CoursesPage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl">
                <PageHeader
                    eyebrow={
                        <Badge variant="info">
                            Course workspace
                        </Badge>
                    }
                    title="Courses"
                    description="Create courses and organise documents, questions and study resources in one learning workspace."
                    actions={
                        <Button disabled>
                            <Plus
                                className="size-4"
                                aria-hidden="true"
                            />
                            Create course
                        </Button>
                    }
                />

                <Card className="mt-8 border-dashed shadow-none">
                    <CardContent className="py-12 text-center sm:py-16">
                        <div
                            className="mx-auto grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-700"
                            aria-hidden="true"
                        >
                            <BookOpenText className="size-6" />
                        </div>

                        <h2 className="mt-5 text-base font-semibold text-text-primary">
                            Course integration begins in M59
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                            This route currently verifies the global
                            navigation and application layout. Real course
                            data and CRUD operations will be connected later.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}