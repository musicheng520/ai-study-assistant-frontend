import type {
    DocumentStatus,
    DocumentType,
} from "@/features/documents/model/document.schema";

const documentTypeLabels: Record<
    DocumentType,
    string
> = {
    LECTURE: "Lecture",
    ASSIGNMENT_BRIEF: "Assignment brief",
    RUBRIC: "Rubric",
    EXAM_NOTES: "Exam notes",
    READING: "Reading",
    OTHER: "Other",
};

const documentStatusLabels: Record<
    DocumentStatus,
    string
> = {
    PROCESSING: "Processing",
    READY: "Ready",
    FAILED: "Failed",
};

export function getDocumentTypeLabel(
    documentType: DocumentType,
): string {
    return documentTypeLabels[documentType];
}

export function getDocumentStatusLabel(
    status: DocumentStatus,
): string {
    return documentStatusLabels[status];
}

export function formatFileSize(
    fileSize: number,
): string {
    if (
        !Number.isFinite(fileSize) ||
        fileSize < 0
    ) {
        return "Unknown size";
    }

    if (fileSize < 1024) {
        return `${fileSize} B`;
    }

    const kilobytes = fileSize / 1024;

    if (kilobytes < 1024) {
        return `${kilobytes.toFixed(1)} KB`;
    }

    const megabytes = kilobytes / 1024;

    if (megabytes < 1024) {
        return `${megabytes.toFixed(1)} MB`;
    }

    const gigabytes = megabytes / 1024;

    return `${gigabytes.toFixed(1)} GB`;
}

export function formatDocumentDate(
    value: string,
): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(date);
}