import {
    BrainCircuit,
    FileText,
    Info,
    RefreshCw,
    Sparkles,
    Trash2,
} from "lucide-react";
import { useState } from "react";

import {
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import {
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

type DocumentCardProps = {
    courseId: number;
    document: CourseDocument;
    onOpenDetails: (
        document: CourseDocument,
    ) => void;
    onDelete: (
        document: CourseDocument,
    ) => void;
};

export function DocumentCard({
                                 courseId,
                                 document,
                                 onOpenDetails,
                                 onDelete,
                             }: DocumentCardProps) {
    const retryMutation =
        useRetryDocumentMutation();

    const [
        retryError,
        setRetryError,
    ] = useState<ApiError | null>(null);

    const statusQuery =
        useDocumentStatusQuery({
            courseId,
            documentId: document.id,
            enabled:
                document.status === "PROCESSING",
        });

    const status =
        statusQuery.data?.status ??
        document.status;

    const errorMessage =
        statusQuery.data?.errorMessage ??
        document.errorMessage;

    const chunkCount =
        statusQuery.data?.chunkCount ??
        document.chunkCount;

    async function handleRetry(): Promise<void> {
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
        <Card className="overflow-hidden">
            <div
                className={[
                    "h-1.5",
                    status === "READY"
                        ? "bg-emerald-500"
                        : status === "FAILED"
                            ? "bg-red-500"
                            : "bg-amber-500",
                ].join(" ")}
                aria-hidden="true"
            />

            <CardHeader>
                <div className="flex items-start gap-3">
          <span
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
              aria-hidden="true"
          >
            <FileText className="size-5" />
          </span>

                    <div className="min-w-0 flex-1">
                        <CardTitle
                            className="break-words text-base"
                            title={document.originalFileName}
                        >
                            {document.originalFileName}
                        </CardTitle>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <DocumentStatusBadge
                                status={status}
                            />

                            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
                {getDocumentTypeLabel(
                    document.documentType,
                )}
              </span>

                            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium uppercase text-text-secondary">
                {document.fileType}
              </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-canvas p-3">
                        <dt className="text-xs text-text-muted">
                            File size
                        </dt>

                        <dd className="mt-1 font-medium text-text-primary">
                            {formatFileSize(
                                document.fileSize,
                            )}
                        </dd>
                    </div>

                    <div className="rounded-xl bg-canvas p-3">
                        <dt className="text-xs text-text-muted">
                            Chunks
                        </dt>

                        <dd className="mt-1 font-medium text-text-primary">
                            {chunkCount}
                        </dd>
                    </div>

                    <div className="rounded-xl bg-canvas p-3">
                        <dt className="text-xs text-text-muted">
                            Pages
                        </dt>

                        <dd className="mt-1 font-medium text-text-primary">
                            {document.totalPages ?? "—"}
                        </dd>
                    </div>

                    <div className="rounded-xl bg-canvas p-3">
                        <dt className="text-xs text-text-muted">
                            Uploaded
                        </dt>

                        <dd className="mt-1 text-xs font-medium leading-5 text-text-primary">
                            {formatDocumentDate(
                                document.createdAt,
                            )}
                        </dd>
                    </div>
                </dl>

                {status === "PROCESSING" ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <div className="flex items-start gap-2">
                            <RefreshCw
                                className="mt-0.5 size-4 shrink-0 animate-spin text-amber-700"
                                aria-hidden="true"
                            />

                            <div>
                                <p className="text-sm font-medium text-amber-900">
                                    Processing document
                                </p>

                                <p className="mt-1 text-xs leading-5 text-amber-800">
                                    Status is checked automatically
                                    every two seconds while this page
                                    is active.
                                </p>
                            </div>
                        </div>

                        {statusQuery.isError ? (
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-amber-200 pt-3">
                                <p className="text-xs text-amber-800">
                                    The latest status check failed.
                                </p>

                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                        void statusQuery.refetch();
                                    }}
                                >
                                    <RefreshCw
                                        className="size-3.5"
                                        aria-hidden="true"
                                    />
                                    Check again
                                </Button>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {status === "FAILED" ? (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                        <p className="text-sm font-medium text-red-900">
                            Processing failed
                        </p>

                        <p className="mt-1 break-words text-xs leading-5 text-red-800">
                            {errorMessage ||
                                "The backend could not process this document."}
                        </p>

                        {retryError ? (
                            <p
                                className="mt-2 text-xs font-medium text-red-800"
                                role="alert"
                            >
                                {retryError.message}
                            </p>
                        ) : null}

                        <Button
                            className="mt-3"
                            disabled={
                                retryMutation.isPending
                            }
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                void handleRetry();
                            }}
                        >
                            <RefreshCw
                                className={[
                                    "size-3.5",
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
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                        <div className="flex items-start gap-2">
                            <BrainCircuit
                                className="mt-0.5 size-4 shrink-0 text-emerald-700"
                                aria-hidden="true"
                            />

                            <div>
                                <p className="text-sm font-medium text-emerald-900">
                                    Ready for AI
                                </p>

                                <p className="mt-1 text-xs leading-5 text-emerald-800">
                                    This document can now be used for
                                    questions and generated study
                                    resources.
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                                disabled
                                size="sm"
                                variant="secondary"
                            >
                                <BrainCircuit
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                                Ask · M61
                            </Button>

                            <Button
                                disabled
                                size="sm"
                                variant="secondary"
                            >
                                <Sparkles
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                                Generate · M62
                            </Button>
                        </div>
                    </div>
                ) : null}
            </CardContent>

            <CardFooter className="flex-wrap justify-between gap-3">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        onOpenDetails(document);
                    }}
                >
                    <Info
                        className="size-4"
                        aria-hidden="true"
                    />
                    Details
                </Button>

                <Button
                    className="text-red-700 hover:bg-red-50 hover:text-red-800"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                        onDelete(document);
                    }}
                >
                    <Trash2
                        className="size-4"
                        aria-hidden="true"
                    />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}