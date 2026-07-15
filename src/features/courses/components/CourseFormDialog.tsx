import { zodResolver } from "@hookform/resolvers/zod";
import {
    BookOpen,
    Save,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";
import { useForm } from "react-hook-form";

import { ErrorState } from "@/components/feedback";
import {
    Button,
    Dialog,
    Input,
} from "@/components/ui";
import {
    useCreateCourseMutation,
    useUpdateCourseMutation,
} from "@/features/courses/api";
import {
    courseFormSchema,
    toCourseRequest,
    type Course,
    type CourseFormValues,
} from "@/features/courses/model";
import {
    type ApiError,
    toApiError,
} from "@/lib/errors/ApiError";
import { cn } from "@/lib/utils/cn";

const courseColorOptions = [
    "#2563eb",
    "#7c3aed",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
    "#475569",
];

type CourseFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course?: Course;
    onSaved?: (course: Course) => void;
};

export function CourseFormDialog({
                                     open,
                                     onOpenChange,
                                     course,
                                     onSaved,
                                 }: CourseFormDialogProps) {
    const createMutation =
        useCreateCourseMutation();

    const updateMutation =
        useUpdateCourseMutation();

    const [
        submissionError,
        setSubmissionError,
    ] = useState<ApiError | null>(null);

    const isEditMode =
        course !== undefined;

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CourseFormValues>({
        resolver: zodResolver(
            courseFormSchema,
        ),
        defaultValues: {
            name: "",
            code: "",
            description: "",
            color: "#2563eb",
        },
    });

    const selectedColor =
        watch("color");

    useEffect(() => {
        if (!open) {
            return;
        }

        setSubmissionError(null);

        reset({
            name: course?.name ?? "",
            code: course?.code ?? "",
            description:
                course?.description ?? "",
            color:
                course?.color ?? "#2563eb",
        });
    }, [
        course,
        open,
        reset,
    ]);

    async function onSubmit(
        formValues: CourseFormValues,
    ): Promise<void> {
        setSubmissionError(null);

        const request =
            toCourseRequest(formValues);

        try {
            const savedCourse = course
                ? await updateMutation.mutateAsync({
                    courseId: course.id,
                    request,
                })
                : await createMutation.mutateAsync(
                    request,
                );

            onOpenChange(false);
            onSaved?.(savedCourse);
        } catch (error) {
            const apiError =
                toApiError(error);

            const fieldErrors =
                apiError.fieldErrors;

            let fieldErrorApplied = false;

            if (fieldErrors?.name) {
                setError("name", {
                    type: "server",
                    message: fieldErrors.name,
                });

                fieldErrorApplied = true;
            }

            if (fieldErrors?.code) {
                setError("code", {
                    type: "server",
                    message: fieldErrors.code,
                });

                fieldErrorApplied = true;
            }

            if (fieldErrors?.description) {
                setError("description", {
                    type: "server",
                    message:
                    fieldErrors.description,
                });

                fieldErrorApplied = true;
            }

            if (fieldErrors?.color) {
                setError("color", {
                    type: "server",
                    message: fieldErrors.color,
                });

                fieldErrorApplied = true;
            }

            if (!fieldErrorApplied) {
                setSubmissionError(apiError);
            }
        }
    }

    const isBusy =
        isSubmitting ||
        createMutation.isPending ||
        updateMutation.isPending;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            preventClose={isBusy}
            title={
                isEditMode
                    ? "Edit course"
                    : "Create course"
            }
            description={
                isEditMode
                    ? "Update the course information shown throughout the workspace."
                    : "Create a workspace for documents, questions and study resources."
            }
        >
            <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="space-y-5 px-5 py-5 sm:px-6">
                    {submissionError ? (
                        <ErrorState
                            compact
                            title={
                                isEditMode
                                    ? "Course update failed"
                                    : "Course creation failed"
                            }
                            message={
                                submissionError.message
                            }
                        />
                    ) : null}

                    <div>
                        <label
                            className="text-sm font-medium text-text-primary"
                            htmlFor="course-name"
                        >
                            Course name
                        </label>

                        <div className="relative mt-2">
                            <BookOpen
                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                                aria-hidden="true"
                            />

                            <Input
                                id="course-name"
                                data-autofocus="true"
                                className="pl-10"
                                placeholder="Machine Learning"
                                aria-describedby={
                                    errors.name
                                        ? "course-name-error"
                                        : undefined
                                }
                                aria-invalid={
                                    errors.name
                                        ? "true"
                                        : "false"
                                }
                                disabled={isBusy}
                                {...register("name")}
                            />
                        </div>

                        {errors.name ? (
                            <p
                                id="course-name-error"
                                className="mt-2 text-sm text-red-700"
                                role="alert"
                            >
                                {errors.name.message}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label
                            className="text-sm font-medium text-text-primary"
                            htmlFor="course-code"
                        >
                            Course code
                        </label>

                        <Input
                            id="course-code"
                            className="mt-2"
                            placeholder="CS501"
                            aria-describedby={
                                errors.code
                                    ? "course-code-error"
                                    : "course-code-help"
                            }
                            aria-invalid={
                                errors.code
                                    ? "true"
                                    : "false"
                            }
                            disabled={isBusy}
                            {...register("code")}
                        />

                        {errors.code ? (
                            <p
                                id="course-code-error"
                                className="mt-2 text-sm text-red-700"
                                role="alert"
                            >
                                {errors.code.message}
                            </p>
                        ) : (
                            <p
                                id="course-code-help"
                                className="mt-2 text-xs text-text-muted"
                            >
                                Optional. For example CS501.
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            className="text-sm font-medium text-text-primary"
                            htmlFor="course-description"
                        >
                            Description
                        </label>

                        <textarea
                            id="course-description"
                            className={[
                                "mt-2 min-h-28 w-full",
                                "resize-y rounded-lg",
                                "border border-line bg-surface",
                                "px-3 py-2.5 text-sm",
                                "text-text-primary outline-none",
                                "transition-colors",
                                "placeholder:text-text-muted",
                                "focus:border-brand-600",
                                "focus:ring-2",
                                "focus:ring-brand-100",
                                "disabled:cursor-not-allowed",
                                "disabled:bg-surface-muted",
                                errors.description
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                    : "",
                            ].join(" ")}
                            placeholder="What will you study in this course?"
                            aria-describedby={
                                errors.description
                                    ? "course-description-error"
                                    : undefined
                            }
                            aria-invalid={
                                errors.description
                                    ? "true"
                                    : "false"
                            }
                            disabled={isBusy}
                            {...register("description")}
                        />

                        {errors.description ? (
                            <p
                                id="course-description-error"
                                className="mt-2 text-sm text-red-700"
                                role="alert"
                            >
                                {
                                    errors.description
                                        .message
                                }
                            </p>
                        ) : null}
                    </div>

                    <fieldset>
                        <legend className="text-sm font-medium text-text-primary">
                            Course color
                        </legend>

                        <div className="mt-3 flex flex-wrap gap-3">
                            {courseColorOptions.map(
                                (color) => (
                                    <button
                                        key={color}
                                        aria-label={`Select course color ${color}`}
                                        aria-pressed={
                                            selectedColor === color
                                        }
                                        className={cn(
                                            [
                                                "size-9 rounded-full",
                                                "border-2 border-white",
                                                "shadow-sm ring-1",
                                                "ring-slate-200",
                                                "transition-transform",
                                                "hover:scale-105",
                                                "focus-visible:outline-2",
                                                "focus-visible:outline-offset-2",
                                                "focus-visible:outline-brand-600",
                                            ],
                                            selectedColor === color &&
                                            "ring-2 ring-brand-700 ring-offset-2",
                                        )}
                                        disabled={isBusy}
                                        onClick={() => {
                                            setValue(
                                                "color",
                                                color,
                                                {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                },
                                            );
                                        }}
                                        style={{
                                            backgroundColor: color,
                                        }}
                                        type="button"
                                    />
                                ),
                            )}
                        </div>

                        <input
                            type="hidden"
                            {...register("color")}
                        />

                        {errors.color ? (
                            <p
                                className="mt-2 text-sm text-red-700"
                                role="alert"
                            >
                                {errors.color.message}
                            </p>
                        ) : null}
                    </fieldset>
                </div>

                <footer className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4 sm:px-6">
                    <Button
                        disabled={isBusy}
                        onClick={() => {
                            onOpenChange(false);
                        }}
                        variant="secondary"
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={isBusy}
                        type="submit"
                    >
                        <Save
                            className="size-4"
                            aria-hidden="true"
                        />

                        {isBusy
                            ? "Saving..."
                            : isEditMode
                                ? "Save changes"
                                : "Create course"}
                    </Button>
                </footer>
            </form>
        </Dialog>
    );
}