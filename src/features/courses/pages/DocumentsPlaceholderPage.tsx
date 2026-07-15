import {
    FileText,
    Upload,
} from "lucide-react";

import {
    Badge,
    Card,
    CardContent,
} from "@/components/ui";
import { useCourseContext } from "@/features/courses/layouts/CourseLayout";

export function DocumentsPlaceholderPage() {
    const { course } =
        useCourseContext();

    return (
        <Card className="border-dashed shadow-none">
            <CardContent className="py-12 text-center sm:py-16">
                <div
                    className="mx-auto grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-700"
                    aria-hidden="true"
                >
                    <FileText className="size-6" />
                </div>

                <Badge
                    className="mt-5"
                    variant="warning"
                >
                    M60 Documents
                </Badge>

                <h2 className="mt-4 text-lg font-semibold text-text-primary">
                    Document workspace is next
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-secondary">
                    Upload, processing status, polling,
                    retry and deletion for{" "}
                    <strong>{course.name}</strong> will
                    be implemented in M60.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-700">
                    <Upload
                        className="size-4"
                        aria-hidden="true"
                    />
                    Upload flow pending
                </div>
            </CardContent>
        </Card>
    );
}