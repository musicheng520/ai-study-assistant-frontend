import {
    FileSearch,
    Files,
    Filter,
    MessageSquareText,
    RefreshCw,
    Search,
    Sparkles,
    Upload,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";
import {
    Link,
    useSearchParams,
} from "react-router";

import {
    EmptyState,
    ErrorState,
} from "@/components/feedback";
import {
    Badge,
    Button,
    Card,
    CardContent,
    Input,
    buttonVariants,
} from "@/components/ui";
import { useCourseContext } from "@/features/courses/context/course-context";
import { useDocumentsQuery } from "@/features/documents/api";
import {
    DeleteDocumentDialog,
    DocumentCard,
    DocumentDetailsDialog,
    DocumentUploadPanel,
    DocumentsListSkeleton,
} from "@/features/documents/components";
import {
    documentStatusValues,
    documentTypeValues,
    getDocumentTypeLabel,
    type CourseDocument,
    type DocumentStatus,
    type DocumentType,
} from "@/features/documents/model";
import { toApiError } from "@/lib/errors/ApiError";

type StatusFilter =
    | "ALL"
    | DocumentStatus;

type TypeFilter =
    | "ALL"
    | DocumentType;

type FileTypeFilter =
    | "ALL"
    | "pdf"
    | "docx";

type SortOption =
    | "newest"
    | "oldest"
    | "name";

function isDocumentStatus(
    value: string | null,
): value is DocumentStatus {
    return documentStatusValues.some(
        (status) => status === value,
    );
}

function isDocumentType(
    value: string | null,
): value is DocumentType {
    return documentTypeValues.some(
        (documentType) =>
            documentType === value,
    );
}

function parseStatusFilter(
    value: string | null,
): StatusFilter {
    return isDocumentStatus(value)
        ? value
        : "ALL";
}

function parseTypeFilter(
    value: string | null,
): TypeFilter {
    return isDocumentType(value)
        ? value
        : "ALL";
}

function parseFileTypeFilter(
    value: string | null,
): FileTypeFilter {
    return value === "pdf" ||
    value === "docx"
        ? value
        : "ALL";
}

function parseSortOption(
    value: string | null,
): SortOption {
    if (
        value === "oldest" ||
        value === "name"
    ) {
        return value;
    }

    return "newest";
}

function getTimestamp(
    value: string,
): number {
    const timestamp =
        new Date(value).getTime();

    return Number.isNaN(timestamp)
        ? 0
        : timestamp;
}

export function DocumentsPage() {
    const { course } =
        useCourseContext();

    const documentsQuery =
        useDocumentsQuery(course.id);

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const [
        selectedDocumentId,
        setSelectedDocumentId,
    ] = useState<number | null>(null);

    const [
        deletingDocument,
        setDeletingDocument,
    ] = useState<CourseDocument | null>(
        null,
    );

    const searchQuery =
        searchParams.get("q") ?? "";

    const statusFilter =
        parseStatusFilter(
            searchParams.get("status"),
        );

    const typeFilter =
        parseTypeFilter(
            searchParams.get("type"),
        );

    const fileTypeFilter =
        parseFileTypeFilter(
            searchParams.get("fileType"),
        );

    const sortOption =
        parseSortOption(
            searchParams.get("sort"),
        );

    const documents =
        documentsQuery.data ?? [];

    const readyCount =
        documents.filter(
            (document) =>
                document.status === "READY",
        ).length;

    const processingCount =
        documents.filter(
            (document) =>
                document.status ===
                "PROCESSING",
        ).length;

    const failedCount =
        documents.filter(
            (document) =>
                document.status === "FAILED",
        ).length;

    const filteredDocuments =
        useMemo(() => {
            const normalizedSearch =
                searchQuery
                    .trim()
                    .toLowerCase();

            const matchingDocuments =
                documents.filter((document) => {
                    const matchesSearch =
                        !normalizedSearch ||
                        [
                            document.originalFileName,
                            document.fileType,
                            getDocumentTypeLabel(
                                document.documentType,
                            ),
                        ]
                            .join(" ")
                            .toLowerCase()
                            .includes(
                                normalizedSearch,
                            );

                    const matchesStatus =
                        statusFilter === "ALL" ||
                        document.status ===
                        statusFilter;

                    const matchesType =
                        typeFilter === "ALL" ||
                        document.documentType ===
                        typeFilter;

                    const normalizedFileType =
                        document.fileType
                            .toLowerCase()
                            .replace(".", "");

                    const matchesFileType =
                        fileTypeFilter === "ALL" ||
                        normalizedFileType ===
                        fileTypeFilter;

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesType &&
                        matchesFileType
                    );
                });

            return matchingDocuments.sort(
                (first, second) => {
                    if (sortOption === "name") {
                        return first.originalFileName.localeCompare(
                            second.originalFileName,
                        );
                    }

                    const firstTimestamp =
                        getTimestamp(
                            first.createdAt,
                        );

                    const secondTimestamp =
                        getTimestamp(
                            second.createdAt,
                        );

                    return sortOption === "oldest"
                        ? firstTimestamp -
                        secondTimestamp
                        : secondTimestamp -
                        firstTimestamp;
                },
            );
        }, [
            documents,
            fileTypeFilter,
            searchQuery,
            sortOption,
            statusFilter,
            typeFilter,
        ]);

    function updateSearchParameter(
        name: string,
        value: string,
        defaultValue = "",
    ): void {
        const nextSearchParams =
            new URLSearchParams(
                searchParams,
            );

        if (
            value === defaultValue ||
            value.trim() === ""
        ) {
            nextSearchParams.delete(name);
        } else {
            nextSearchParams.set(
                name,
                value,
            );
        }

        setSearchParams(
            nextSearchParams,
            {
                replace: true,
                preventScrollReset: true,
            },
        );
    }

    function clearFilters(): void {
        setSearchParams(
            new URLSearchParams(),
            {
                replace: true,
                preventScrollReset: true,
            },
        );
    }

    const filtersAreActive =
        searchQuery.trim() !== "" ||
        statusFilter !== "ALL" ||
        typeFilter !== "ALL" ||
        fileTypeFilter !== "ALL" ||
        sortOption !== "newest";

    return (
        <div className="space-y-6">
            <section
                aria-labelledby="document-upload-title"
            >
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <Upload
                                className="size-5 text-brand-700"
                                aria-hidden="true"
                            />

                            <h2
                                id="document-upload-title"
                                className="text-lg font-semibold text-text-primary"
                            >
                                Add documents
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-text-secondary">
                            Upload PDFs and DOCX files to{" "}
                            {course.name}. Once documents are READY,
                            you can ask cited questions or generate study
                            materials.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to={`/courses/${course.id}/chat`}
                            className={buttonVariants({
                                variant: "secondary",
                                size: "sm",
                            })}
                        >
                            <MessageSquareText
                                className="size-4"
                                aria-hidden="true"
                            />
                            Ask AI
                        </Link>

                        <Link
                            to={`/courses/${course.id}/study`}
                            className={buttonVariants({
                                variant: "secondary",
                                size: "sm",
                            })}
                        >
                            <Sparkles
                                className="size-4"
                                aria-hidden="true"
                            />
                            Open Study Hub
                        </Link>
                    </div>
                </div>

                <DocumentUploadPanel
                    courseId={course.id}
                />
            </section>

            <section
                aria-labelledby="course-documents-title"
            >
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Files
                                className="size-5 text-brand-700"
                                aria-hidden="true"
                            />

                            <h2
                                id="course-documents-title"
                                className="text-lg font-semibold text-text-primary"
                            >
                                Course documents
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-text-secondary">
                            Review document processing and
                            manage course knowledge sources.
                        </p>
                    </div>

                    <Button
                        disabled={
                            documentsQuery.isFetching
                        }
                        variant="secondary"
                        onClick={() => {
                            void documentsQuery.refetch();
                        }}
                    >
                        <RefreshCw
                            className={[
                                "size-4",
                                documentsQuery.isFetching
                                    ? "animate-spin"
                                    : "",
                            ].join(" ")}
                            aria-hidden="true"
                        />
                        Refresh
                    </Button>
                </div>

                {!documentsQuery.isPending &&
                !documentsQuery.isError ? (
                    <div className="mt-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="neutral">
                                {documents.length} total
                            </Badge>

                            <Badge variant="success">
                                {readyCount} ready
                            </Badge>

                            <Badge variant="warning">
                                {processingCount} processing
                            </Badge>

                            <Badge variant="destructive">
                                {failedCount} failed
                            </Badge>
                        </div>

                        {documents.length > 0 && readyCount === 0 ? (
                            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                                AI Chat and Study generation work best after at
                                least one document reaches READY status.
                            </p>
                        ) : null}

                        {readyCount > 0 ? (
                            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
                                {readyCount} document
                                {readyCount === 1 ? "" : "s"} ready. You can
                                now use AI Chat or generate summaries, quizzes
                                and flashcards from this course.
                            </p>
                        ) : null}
                    </div>
                ) : null}

                {documentsQuery.isPending ? (
                    <div className="mt-6">
                        <DocumentsListSkeleton />
                    </div>
                ) : null}

                {documentsQuery.isError ? (
                    <div className="mt-6">
                        <ErrorState
                            title="Documents could not be loaded"
                            message={
                                toApiError(
                                    documentsQuery.error,
                                ).message
                            }
                            onRetry={() => {
                                void documentsQuery.refetch();
                            }}
                        />
                    </div>
                ) : null}

                {!documentsQuery.isPending &&
                !documentsQuery.isError &&
                documents.length === 0 ? (
                    <div className="mt-6">
                        <EmptyState
                            icon={Upload}
                            title="No documents yet"
                            description="Upload the first PDF or DOCX document for this course."
                        />
                    </div>
                ) : null}

                {!documentsQuery.isPending &&
                !documentsQuery.isError &&
                documents.length > 0 ? (
                    <>
                        <Card className="mt-6 shadow-none">
                            <CardContent className="py-5">
                                <div className="flex items-center gap-2">
                                    <Filter
                                        className="size-4 text-text-muted"
                                        aria-hidden="true"
                                    />

                                    <p className="text-sm font-medium text-text-primary">
                                        Search and filters
                                    </p>
                                </div>

                                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                                    <div className="md:col-span-2 xl:col-span-1">
                                        <label
                                            className="sr-only"
                                            htmlFor="document-search"
                                        >
                                            Search documents
                                        </label>

                                        <div className="relative">
                                            <Search
                                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                                                aria-hidden="true"
                                            />

                                            <Input
                                                id="document-search"
                                                className="pl-10"
                                                placeholder="Search files"
                                                type="search"
                                                value={searchQuery}
                                                onChange={(event) => {
                                                    updateSearchParameter(
                                                        "q",
                                                        event.target.value,
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            className="sr-only"
                                            htmlFor="document-status-filter"
                                        >
                                            Filter by status
                                        </label>

                                        <select
                                            id="document-status-filter"
                                            className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                                            value={statusFilter}
                                            onChange={(event) => {
                                                updateSearchParameter(
                                                    "status",
                                                    event.target.value,
                                                    "ALL",
                                                );
                                            }}
                                        >
                                            <option value="ALL">
                                                All statuses
                                            </option>

                                            {documentStatusValues.map(
                                                (status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className="sr-only"
                                            htmlFor="document-type-filter"
                                        >
                                            Filter by document type
                                        </label>

                                        <select
                                            id="document-type-filter"
                                            className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                                            value={typeFilter}
                                            onChange={(event) => {
                                                updateSearchParameter(
                                                    "type",
                                                    event.target.value,
                                                    "ALL",
                                                );
                                            }}
                                        >
                                            <option value="ALL">
                                                All categories
                                            </option>

                                            {documentTypeValues.map(
                                                (documentType) => (
                                                    <option
                                                        key={
                                                            documentType
                                                        }
                                                        value={
                                                            documentType
                                                        }
                                                    >
                                                        {getDocumentTypeLabel(
                                                            documentType,
                                                        )}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className="sr-only"
                                            htmlFor="document-file-type-filter"
                                        >
                                            Filter by file format
                                        </label>

                                        <select
                                            id="document-file-type-filter"
                                            className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                                            value={fileTypeFilter}
                                            onChange={(event) => {
                                                updateSearchParameter(
                                                    "fileType",
                                                    event.target.value,
                                                    "ALL",
                                                );
                                            }}
                                        >
                                            <option value="ALL">
                                                All formats
                                            </option>
                                            <option value="pdf">
                                                PDF
                                            </option>
                                            <option value="docx">
                                                DOCX
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className="sr-only"
                                            htmlFor="document-sort"
                                        >
                                            Sort documents
                                        </label>

                                        <select
                                            id="document-sort"
                                            className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                                            value={sortOption}
                                            onChange={(event) => {
                                                updateSearchParameter(
                                                    "sort",
                                                    event.target.value,
                                                    "newest",
                                                );
                                            }}
                                        >
                                            <option value="newest">
                                                Newest first
                                            </option>
                                            <option value="oldest">
                                                Oldest first
                                            </option>
                                            <option value="name">
                                                File name
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                                    <p className="text-sm text-text-secondary">
                                        Showing{" "}
                                        <strong>
                                            {filteredDocuments.length}
                                        </strong>{" "}
                                        of{" "}
                                        <strong>
                                            {documents.length}
                                        </strong>{" "}
                                        documents
                                    </p>

                                    {filtersAreActive ? (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={
                                                clearFilters
                                            }
                                        >
                                            Clear filters
                                        </Button>
                                    ) : null}
                                </div>
                            </CardContent>
                        </Card>

                        {filteredDocuments.length >
                        0 ? (
                            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {filteredDocuments.map(
                                    (document) => (
                                        <DocumentCard
                                            key={document.id}
                                            courseId={course.id}
                                            document={document}
                                            onOpenDetails={(
                                                selectedDocument,
                                            ) => {
                                                setSelectedDocumentId(
                                                    selectedDocument.id,
                                                );
                                            }}
                                            onDelete={
                                                setDeletingDocument
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="mt-6">
                                <EmptyState
                                    icon={FileSearch}
                                    title="No matching documents"
                                    description="Change the search term or remove one of the active filters."
                                    action={
                                        <Button
                                            variant="secondary"
                                            onClick={
                                                clearFilters
                                            }
                                        >
                                            Clear filters
                                        </Button>
                                    }
                                />
                            </div>
                        )}
                    </>
                ) : null}
            </section>

            <DocumentDetailsDialog
                open={
                    selectedDocumentId !== null
                }
                courseId={course.id}
                documentId={
                    selectedDocumentId
                }
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedDocumentId(null);
                    }
                }}
                onRequestDelete={(document) => {
                    setSelectedDocumentId(null);
                    setDeletingDocument(document);
                }}
            />

            <DeleteDocumentDialog
                open={
                    deletingDocument !== null
                }
                courseId={course.id}
                document={deletingDocument}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingDocument(null);
                    }
                }}
                onDeleted={(documentId) => {
                    if (
                        selectedDocumentId ===
                        documentId
                    ) {
                        setSelectedDocumentId(null);
                    }

                    setDeletingDocument(null);
                }}
            />
        </div>
    );
}