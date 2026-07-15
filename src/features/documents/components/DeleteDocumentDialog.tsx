import {
    AlertTriangle,
    Trash2,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";

import { ErrorState } from "@/components/feedback";
import {
    Button,
    Dialog,
} from "@/components/ui";
import { useDeleteDocumentMutation } from "@/features/documents/api";
import type { CourseDocument } from "@/features/documents/model";
import {
    type ApiError,
    toApiError,
} from "@/lib/errors/ApiError";

type DeleteDocumentDialogProps = {
    open: boolean;
    courseId: number;
    document: CourseDocument | null;
    onOpenChange: (
        open: boolean,
    ) => void;
    onDeleted?: (
        documentId: number,
    ) => void;
};

export function DeleteDocumentDialog({
                                         open,
                                         courseId,
                                         document,
                                         onOpenChange,
                                         onDeleted,
                                     }: DeleteDocumentDialogProps) {
    const deleteMutation =
        useDeleteDocumentMutation();

    const [
        deletionError,
        setDeletionError,
    ] = useState<ApiError | null>(null);

    useEffect(() => {
        if (open) {
            setDeletionError(null);
        }
    }, [open]);

    async function handleDelete(): Promise<void> {
        if (!document) {
            return;
        }

        setDeletionError(null);

        try {
            await deleteMutation.mutateAsync({
                courseId,
                documentId: document.id,
            });

            onOpenChange(false);
            onDeleted?.(document.id);
        } catch (error) {
            setDeletionError(
                toApiError(error),
            );
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            preventClose={
                deleteMutation.isPending
            }
            title="Delete document"
            description="This action cannot be undone."
        >
            <div className="space-y-5 px-5 py-5 sm:px-6">
                {deletionError ? (
                    <ErrorState
                        compact
                        title="Document deletion failed"
                        message={
                            deletionError.message
                        }
                    />
                ) : null}

                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertTriangle
                        className="mt-0.5 size-5 shrink-0 text-red-700"
                        aria-hidden="true"
                    />

                    <div>
                        <p className="break-words text-sm font-medium text-red-900">
                            Delete{" "}
                            {document?.originalFileName ??
                                "this document"}?
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-800">
                            Its extracted chunks and associated
                            document-level AI resources may also
                            be removed by the backend.
                        </p>
                    </div>
                </div>
            </div>

            <footer className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4 sm:px-6">
                <Button
                    disabled={
                        deleteMutation.isPending
                    }
                    variant="secondary"
                    onClick={() => {
                        onOpenChange(false);
                    }}
                >
                    Cancel
                </Button>

                <Button
                    disabled={
                        deleteMutation.isPending ||
                        !document
                    }
                    variant="destructive"
                    onClick={() => {
                        void handleDelete();
                    }}
                >
                    <Trash2
                        className="size-4"
                        aria-hidden="true"
                    />

                    {deleteMutation.isPending
                        ? "Deleting..."
                        : "Delete document"}
                </Button>
            </footer>
        </Dialog>
    );
}