import {
    FileText,
    RefreshCcw,
} from "lucide-react";

import {
    Badge,
    Button,
    Dialog,
} from "@/components/ui";

import { useSourceChunkQuery } from "../api";
import type { ChatCitation } from "../model";

type CitationSourceViewerProps = {
    open: boolean;
    courseId: number;
    citation: ChatCitation | null;
    onOpenChange: (open: boolean) => void;
};

export function CitationSourceViewer({
                                         open,
                                         courseId,
                                         citation,
                                         onOpenChange,
                                     }: CitationSourceViewerProps) {
    const chunkId =
        open && citation
            ? citation.chunkId
            : null;

    const sourceChunkQuery =
        useSourceChunkQuery(
            open ? courseId : null,
            chunkId,
        );

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            title="Citation source"
            description="Review the original course material chunk used by the AI answer."
            className="flex max-h-[calc(100dvh-2rem)] flex-col"
        >
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                {citation ? (
                    <div className="rounded-2xl border border-line bg-surface-muted p-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="info">
                                Chunk #{citation.chunkId}
                            </Badge>

                            <Badge variant="neutral">
                                Document #{citation.documentId}
                            </Badge>

                            {citation.pageNumber ? (
                                <Badge variant="neutral">
                                    Page {citation.pageNumber}
                                </Badge>
                            ) : null}
                        </div>

                        <div className="mt-3 flex items-start gap-3">
                            <FileText
                                className="mt-0.5 size-5 shrink-0 text-brand-700"
                                aria-hidden="true"
                            />

                            <div className="min-w-0">
                                <p className="break-words text-sm font-semibold text-text-primary">
                                    {citation.fileName}
                                </p>

                                {citation.sectionTitle ? (
                                    <p className="mt-1 text-sm text-text-secondary">
                                        {
                                            citation.sectionTitle
                                        }
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <blockquote className="mt-4 border-l-2 border-brand-300 pl-3 text-sm leading-6 text-text-secondary">
                            {citation.snippet}
                        </blockquote>
                    </div>
                ) : null}

                {sourceChunkQuery.isPending ? (
                    <div className="space-y-3 rounded-2xl border border-line p-4">
                        <div className="h-4 w-1/3 rounded bg-surface-muted" />
                        <div className="h-3 w-full rounded bg-surface-muted" />
                        <div className="h-3 w-5/6 rounded bg-surface-muted" />
                        <div className="h-3 w-2/3 rounded bg-surface-muted" />
                    </div>
                ) : null}

                {sourceChunkQuery.isError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-900">
                            Failed to load source chunk
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-800">
                            The citation metadata is available,
                            but the full source chunk could not
                            be loaded.
                        </p>

                        <Button
                            className="mt-4"
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                void sourceChunkQuery.refetch();
                            }}
                        >
                            <RefreshCcw
                                className="size-4"
                                aria-hidden="true"
                            />
                            Retry
                        </Button>
                    </div>
                ) : null}

                {sourceChunkQuery.data ? (
                    <div className="rounded-2xl border border-line bg-surface p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-text-primary">
                                    Full source chunk
                                </p>

                                <p className="mt-1 break-words text-xs text-text-muted">
                                    {sourceChunkQuery.data.fileName}
                                    {sourceChunkQuery.data.pageNumber
                                        ? ` · Page ${sourceChunkQuery.data.pageNumber}`
                                        : ""}
                                    {sourceChunkQuery.data.sectionTitle
                                        ? ` · ${sourceChunkQuery.data.sectionTitle}`
                                        : ""}
                                </p>
                            </div>

                            <Badge
                                variant={
                                    sourceChunkQuery.data.vectorStatus ===
                                    "READY"
                                        ? "success"
                                        : "neutral"
                                }
                            >
                                {
                                    sourceChunkQuery.data
                                        .vectorStatus
                                }
                            </Badge>
                        </div>

                        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-surface-muted p-4 text-sm leading-6 text-text-primary">
                            {sourceChunkQuery.data.content}
                        </pre>
                    </div>
                ) : null}
            </div>

            <footer className="shrink-0 border-t border-line px-5 py-4 sm:px-6">
                <div className="flex justify-end">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            onOpenChange(false);
                        }}
                    >
                        Close
                    </Button>
                </div>
            </footer>
        </Dialog>
    );
}