export {
    documentResponseSchema,
    documentStatusResponseSchema,
    documentStatusSchema,
    documentStatusValues,
    documentTypeSchema,
    documentTypeValues,
} from "./document.schema";

export type {
    CourseDocument,
    DocumentStatus,
    DocumentStatusResponse,
    DocumentType,
} from "./document.schema";

export {
    formatDocumentDate,
    formatFileSize,
    getDocumentStatusLabel,
    getDocumentTypeLabel,
} from "./documentPresentation";

export {
    DOCUMENT_FILE_ACCEPT,
    MAX_DOCUMENT_FILE_SIZE_BYTES,
    validateDocumentFile,
} from "./documentUpload";

export type {
    DocumentUploadProgress,
    UploadDocumentArguments,
} from "./documentUpload";