import type { DocumentType } from "@/features/documents/model/document.schema";

export const MAX_DOCUMENT_FILE_SIZE_BYTES =
    40 * 1024 * 1024;

export const DOCUMENT_FILE_ACCEPT =
    ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const pdfMimeTypes = new Set([
    "application/pdf",
    "application/octet-stream",
]);

const docxMimeTypes = new Set([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "application/octet-stream",
]);

export type DocumentUploadProgress = {
    loadedBytes: number;
    totalBytes: number;
    percentage: number;
};

export type UploadDocumentArguments = {
    courseId: number;
    file: File;
    documentType: DocumentType;
    onProgress?: (
        progress: DocumentUploadProgress,
    ) => void;
};

function getFileExtension(
    fileName: string,
): string {
    const normalizedFileName =
        fileName.toLowerCase();

    const finalDotIndex =
        normalizedFileName.lastIndexOf(".");

    if (finalDotIndex < 0) {
        return "";
    }

    return normalizedFileName.slice(
        finalDotIndex,
    );
}

export function validateDocumentFile(
    file: File,
): string | null {
    if (file.size === 0) {
        return "The selected file is empty.";
    }

    if (
        file.size >
        MAX_DOCUMENT_FILE_SIZE_BYTES
    ) {
        return "The file cannot exceed 40 MB.";
    }

    const extension =
        getFileExtension(file.name);

    if (
        extension !== ".pdf" &&
        extension !== ".docx"
    ) {
        return "Only PDF and DOCX files are supported.";
    }

    /*
     * 某些浏览器或操作系统可能返回空 MIME，
     * 因此扩展名正确时允许空 MIME，
     * 最终安全校验仍由后端完成。
     */
    if (!file.type) {
        return null;
    }

    if (
        extension === ".pdf" &&
        !pdfMimeTypes.has(file.type)
    ) {
        return "The selected file does not appear to be a valid PDF.";
    }

    if (
        extension === ".docx" &&
        !docxMimeTypes.has(file.type)
    ) {
        return "The selected file does not appear to be a valid DOCX file.";
    }

    return null;
}