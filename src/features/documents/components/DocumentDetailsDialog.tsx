import {
    BrainCircuit,
    CalendarClock,
    FileStack,
    FileText,
    Layers3,
    RefreshCw,
    Sparkles,
    Trash2,
} from "lucide-react";
import { useState } from "react";

import {
    ErrorState,
} from "@/components/feedback";
import {
    Badge,
    Button,
    Dialog,
    Skeleton,
} from "@/components/ui";
import {
    useDocumentDetailQuery,
    useDocumentStatusQuery,
    useRetryDocumentMutation,
} from "@/features/documents/api";
import { DocumentStatusBadge } from "@/features/documents/components/DocumentStatusBadge";
import {
    formatDocumentDate,
    formatFileSize,
    getDocumentTypeLabel,
    type CourseDocument,
} from "@/features/documents/model";
import {
    type ApiError,
    toApiError,
} from "@/lib/errors/ApiError";

type DocumentDetailsDialogProps = {
    open: boolean;
    courseId: number;
    documentId: number | null;
    onOpenChange: (
        open: boolean,
    ) => void;
    onRequestDelete: (
        document: CourseDocument,
    ) => void;
};

export function DocumentDetailsDialog({
                                          open,
                                          courseId,
                                          documentId,
                                          onOpenChange,
                                          onRequestDelete,
                                      }: DocumentDetailsDialogProps) {
    const detailQuery =
        useDocumentDetailQuery(
            open ? documentId : null,
        );

    const retryMutation =
        useRetryDocumentMutation();

    const [
        retryError,
        setRetryError,
    ] = useState<ApiError | null>(null);

    const document = detailQuery.data;

    const statusQuery =
        useDocumentStatusQuery({
            courseId,
            documentId:
                open ? documentId : null,
            enabled:
                open &&
                documentId !== null &&
                document?.status === "PROCESSING",
        });

    const status =
        statusQuery.data?.status ??
        document?.status;

    const errorMessage =
        statusQuery.data?.errorMessage ??
        document?.errorMessage;

    const chunkCount =
        statusQuery.data?.chunkCount ??
        document?.chunkCount ??
        0;

    async function handleRetry(): Promise<void> {
        if (!document) {
            return;
        }

        setRetryError(null);

        try {
            await retryMutation.mutateAsync({
                courseId,
                documentId: document.id,
            });
        } catch (error) {
            setRetryError(toApiError(error));
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            preventClose={
                retryMutation.isPending
            }
            className="max-w-2xl"
            title={
                document?.originalFileName ??
                "Document details"
            }
            description="Review processing status and document metadata."
        >
            <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
                {detailQuery.isPending ? (
                    <div
                        className="space-y-5"
                        aria-busy="true"
                    >
                        <Skeleton className="h-20 w-full" />

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                        </div>

                        <Skeleton className="h-28 w-full" />
                    </div>
                ) : null}

                {detailQuery.isError ? (
                    <ErrorState
                        compact
                        title="Document details could not be loaded"
                        message={
                            detailQuery.error instanceof
                            Error
                                ? detailQuery.error.message
                                : "The document detail request failed."
                        }
                        onRetry={() => {
                            void detailQuery.refetch();
                        }}
                    />
                ) : null}

                {document && status ? (
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line bg-canvas p-4">
                            <div className="flex min-w-0 items-start gap-3">
                <span
                    className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
                    aria-hidden="true"
                >
                  <FileText className="size-5" />
                </span>

                                <div className="min-w-0">
                                    <p className="break-words text-sm font-semibold text-text-primary">
                                        {document.originalFileName}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Badge variant="neutral">
                                            {getDocumentTypeLabel(
                                                document.documentType,
                                            )}
                                        </Badge>

                                        <Badge variant="neutral">
                                            {document.fileType.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <DocumentStatusBadge
                                status={status}
                            />
                        </div>

                        <dl className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-line bg-canvas p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                                    <FileStack
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    File size
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-text-primary">
                                    {formatFileSize(
                                        document.fileSize,
                                    )}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-line bg-canvas p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                                    <Layers3
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Chunks
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-text-primary">
                                    {chunkCount}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-line bg-canvas p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                                    <FileText
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Pages
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-text-primary">
                                    {document.totalPages ??
                                        "Not available"}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-line bg-canvas p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                                    <CalendarClock
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Last updated
                                </dt>

                                <dd className="mt-2 text-sm font-semibold leading-6 text-text-primary">
                                    {formatDocumentDate(
                                        document.updatedAt,
                                    )}
                                </dd>
                            </div>
                        </dl>

                        {status === "PROCESSING" ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-3">
                                    <RefreshCw
                                        className="mt-0.5 size-5 shrink-0 animate-spin text-amber-700"
                                        aria-hidden="true"
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-amber-900">
                                            Processing in progress
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-amber-800">
                                            The backend has not exposed
                                            individual processing steps, so
                                            the frontend displays only the
                                            real overall status.
                                        </p>
                                    </div>
                                </div>

                                {statusQuery.isError ? (
                                    <Button
                                        className="mt-4"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            void statusQuery.refetch();
                                        }}
                                    >
                                        <RefreshCw
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Check status
                                    </Button>
                                ) : null}
                            </div>
                        ) : null}

                        {status === "FAILED" ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-900">
                                    Processing failed
                                </p>

                                <p className="mt-1 break-words text-sm leading-6 text-red-800">
                                    {errorMessage ||
                                        "No additional error information was returned."}
                                </p>

                                {retryError ? (
                                    <p
                                        className="mt-3 text-sm font-medium text-red-800"
                                        role="alert"
                                    >
                                        {retryError.message}
                                    </p>
                                ) : null}

                                <Button
                                    className="mt-4"
                                    disabled={
                                        retryMutation.isPending
                                    }
                                    variant="secondary"
                                    onClick={() => {
                                        void handleRetry();
                                    }}
                                >
                                    <RefreshCw
                                        className={[
                                            "size-4",
                                            retryMutation.isPending
                                                ? "animate-spin"
                                                : "",
                                        ].join(" ")}
                                        aria-hidden="true"
                                    />

                                    {retryMutation.isPending
                                        ? "Retrying..."
                                        : "Retry processing"}
                                </Button>
                            </div>
                        ) : null}

                        {status === "READY" ? (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <div className="flex items-start gap-3">
                                    <BrainCircuit
                                        className="mt-0.5 size-5 shrink-0 text-emerald-700"
                                        aria-hidden="true"
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-emerald-900">
                                            AI actions available
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-emerald-800">
                                            This document has completed
                                            processing and can be used as an
                                            AI knowledge source.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                    <Button
                                        disabled
                                        variant="secondary"
                                    >
                                        <BrainCircuit
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Ask this document · M61
                                    </Button>

                                    <Button
                                        disabled
                                        variant="secondary"
                                    >
                                        <Sparkles
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Summary · M63
                                    </Button>

                                    <Button
                                        disabled
                                        variant="secondary"
                                    >
                                        <Sparkles
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Quiz · M64
                                    </Button>

                                    <Button
                                        disabled
                                        variant="secondary"
                                    >
                                        <Sparkles
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Flashcards · M65
                                    </Button>

                                    {document.documentType ===
                                    "ASSIGNMENT_BRIEF" ||
                                    document.documentType ===
                                    "RUBRIC" ? (
                                        <Button
                                            disabled
                                            variant="secondary"
                                        >
                                            <FileStack
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                            Analyze · M66
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>

            <footer className="flex flex-wrap justify-between gap-3 border-t border-line px-5 py-4 sm:px-6">
                <Button
                    variant="secondary"
                    onClick={() => {
                        onOpenChange(false);
                    }}
                >
                    Close
                </Button>

                <Button
                    className="text-red-700 hover:bg-red-50 hover:text-red-800"
                    disabled={!document}
                    variant="ghost"
                    onClick={() => {
                        if (!document) {
                            return;
                        }

                        onOpenChange(false);
                        onRequestDelete(document);
                    }}
                >
                    <Trash2
                        className="size-4"
                        aria-hidden="true"
                    />
                    Delete
                </Button>
            </footer>
        </Dialog>
    );
}