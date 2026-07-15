import {
    AlertCircle,
    CheckCircle2,
    CloudUpload,
    FileText,
    LoaderCircle,
    Upload,
    X,
} from "lucide-react";
import {
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
    type FormEvent,
} from "react";

import { ErrorState } from "@/components/feedback";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { useUploadDocumentMutation } from "@/features/documents/api";
import { DocumentTypeSelect } from "@/features/documents/components/DocumentTypeSelect";
import {
    DOCUMENT_FILE_ACCEPT,
    formatFileSize,
    getDocumentStatusLabel,
    getDocumentTypeLabel,
    validateDocumentFile,
    type CourseDocument,
    type DocumentType,
    type DocumentUploadProgress,
} from "@/features/documents/model";
import {
    type ApiError,
    toApiError,
} from "@/lib/errors/ApiError";
import { cn } from "@/lib/utils/cn";

type DocumentUploadPanelProps = {
    courseId: number;

    onUploaded?: (
        document: CourseDocument,
    ) => void;
};

export function DocumentUploadPanel({
                                        courseId,
                                        onUploaded,
                                    }: DocumentUploadPanelProps) {
    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const dragDepthRef =
        useRef(0);

    const fileInputId = useId();
    const documentTypeId = useId();
    const uploadHelpId = useId();

    const uploadMutation =
        useUploadDocumentMutation();

    const [
        selectedFile,
        setSelectedFile,
    ] = useState<File | null>(null);

    const [
        documentType,
        setDocumentType,
    ] = useState<DocumentType>(
        "LECTURE",
    );

    const [
        isDragging,
        setIsDragging,
    ] = useState(false);

    const [
        validationError,
        setValidationError,
    ] = useState<string | null>(null);

    const [
        submissionError,
        setSubmissionError,
    ] = useState<ApiError | null>(null);

    const [
        uploadProgress,
        setUploadProgress,
    ] =
        useState<DocumentUploadProgress | null>(
            null,
        );

    const [
        lastUploadedDocument,
        setLastUploadedDocument,
    ] = useState<CourseDocument | null>(
        null,
    );

    const isUploading =
        uploadMutation.isPending;

    function clearNativeFileInput(): void {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function clearSelectedFile(): void {
        setSelectedFile(null);
        setValidationError(null);
        setSubmissionError(null);
        setUploadProgress(null);

        uploadMutation.reset();

        clearNativeFileInput();
    }

    function selectFiles(
        files: FileList | null,
    ): void {
        setSubmissionError(null);
        setValidationError(null);
        setUploadProgress(null);
        setLastUploadedDocument(null);

        uploadMutation.reset();

        if (!files || files.length === 0) {
            return;
        }

        if (files.length > 1) {
            setSelectedFile(null);

            setValidationError(
                "Upload one document at a time.",
            );

            clearNativeFileInput();
            return;
        }

        const file = files.item(0);

        if (!file) {
            return;
        }

        const fileError =
            validateDocumentFile(file);

        if (fileError) {
            setSelectedFile(null);
            setValidationError(fileError);

            clearNativeFileInput();
            return;
        }

        setSelectedFile(file);
    }

    function handleFileInputChange(
        event: ChangeEvent<HTMLInputElement>,
    ): void {
        selectFiles(event.target.files);
    }

    function handleDragEnter(
        event: DragEvent<HTMLButtonElement>,
    ): void {
        event.preventDefault();
        event.stopPropagation();

        if (isUploading) {
            return;
        }

        dragDepthRef.current += 1;
        setIsDragging(true);
    }

    function handleDragOver(
        event: DragEvent<HTMLButtonElement>,
    ): void {
        event.preventDefault();
        event.stopPropagation();

        if (isUploading) {
            return;
        }

        event.dataTransfer.dropEffect = "copy";
        setIsDragging(true);
    }

    function handleDragLeave(
        event: DragEvent<HTMLButtonElement>,
    ): void {
        event.preventDefault();
        event.stopPropagation();

        if (isUploading) {
            return;
        }

        dragDepthRef.current = Math.max(
            0,
            dragDepthRef.current - 1,
        );

        if (dragDepthRef.current === 0) {
            setIsDragging(false);
        }
    }

    function handleDrop(
        event: DragEvent<HTMLButtonElement>,
    ): void {
        event.preventDefault();
        event.stopPropagation();

        dragDepthRef.current = 0;
        setIsDragging(false);

        if (isUploading) {
            return;
        }

        selectFiles(
            event.dataTransfer.files,
        );
    }

    async function handleUpload(): Promise<void> {
        if (!selectedFile) {
            setValidationError(
                "Select a PDF or DOCX file before uploading.",
            );

            return;
        }

        const fileError =
            validateDocumentFile(selectedFile);

        if (fileError) {
            setValidationError(fileError);
            return;
        }

        setValidationError(null);
        setSubmissionError(null);
        setLastUploadedDocument(null);

        setUploadProgress({
            loadedBytes: 0,
            totalBytes: selectedFile.size,
            percentage: 0,
        });

        try {
            const uploadedDocument =
                await uploadMutation.mutateAsync({
                    courseId,
                    file: selectedFile,
                    documentType,
                    onProgress: (progress) => {
                        setUploadProgress(progress);
                    },
                });

            setLastUploadedDocument(
                uploadedDocument,
            );

            setSelectedFile(null);
            setUploadProgress(null);

            clearNativeFileInput();

            onUploaded?.(uploadedDocument);
        } catch (error) {
            setSubmissionError(
                toApiError(error),
            );
        }
    }

    function handleFormSubmit(
        event: FormEvent<HTMLFormElement>,
    ): void {
        event.preventDefault();

        void handleUpload();
    }

    const selectedFileFormat =
        selectedFile?.name
            .toLowerCase()
            .endsWith(".pdf")
            ? "PDF"
            : "DOCX";

    const displayedProgress =
        uploadProgress?.percentage ?? 0;

    const uploadedStatusVariant =
        lastUploadedDocument?.status === "READY"
            ? "success"
            : lastUploadedDocument?.status ===
            "FAILED"
                ? "destructive"
                : "warning";

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Upload course document
                </CardTitle>

                <CardDescription>
                    Add a PDF or DOCX file to this
                    course. The backend will process
                    and index it for later AI features.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    className="space-y-5"
                    onSubmit={handleFormSubmit}
                >
                    {submissionError ? (
                        <ErrorState
                            compact
                            title="Document upload failed"
                            message={
                                submissionError.message
                            }
                        />
                    ) : null}

                    {validationError ? (
                        <div
                            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                            role="alert"
                        >
                            <AlertCircle
                                className="mt-0.5 size-5 shrink-0 text-red-700"
                                aria-hidden="true"
                            />

                            <div>
                                <p className="text-sm font-medium text-red-900">
                                    File cannot be uploaded
                                </p>

                                <p className="mt-1 text-sm leading-6 text-red-800">
                                    {validationError}
                                </p>
                            </div>
                        </div>
                    ) : null}

                    {lastUploadedDocument ? (
                        <div
                            className={cn(
                                [
                                    "flex items-start gap-3",
                                    "rounded-xl border p-4",
                                ],
                                lastUploadedDocument.status ===
                                "READY"
                                    ? "border-emerald-200 bg-emerald-50"
                                    : lastUploadedDocument.status ===
                                    "FAILED"
                                        ? "border-red-200 bg-red-50"
                                        : "border-amber-200 bg-amber-50",
                            )}
                            aria-live="polite"
                        >
                            <CheckCircle2
                                className={cn(
                                    "mt-0.5 size-5 shrink-0",
                                    lastUploadedDocument.status ===
                                    "READY"
                                        ? "text-emerald-700"
                                        : lastUploadedDocument.status ===
                                        "FAILED"
                                            ? "text-red-700"
                                            : "text-amber-700",
                                )}
                                aria-hidden="true"
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-medium text-text-primary">
                                        Upload completed
                                    </p>

                                    <Badge
                                        variant={
                                            uploadedStatusVariant
                                        }
                                    >
                                        {getDocumentStatusLabel(
                                            lastUploadedDocument.status,
                                        )}
                                    </Badge>
                                </div>

                                <p className="mt-1 break-words text-sm leading-6 text-text-secondary">
                                    {
                                        lastUploadedDocument.originalFileName
                                    }
                                </p>

                                <p className="mt-1 text-xs leading-5 text-text-muted">
                                    {lastUploadedDocument.status ===
                                    "PROCESSING"
                                        ? "The file has reached the backend and document processing has started."
                                        : lastUploadedDocument.status ===
                                        "READY"
                                            ? "The document is ready for course-based AI features."
                                            : "The upload completed, but backend document processing failed."}
                                </p>
                            </div>
                        </div>
                    ) : null}

                    <div>
                        <input
                            ref={fileInputRef}
                            id={fileInputId}
                            className="sr-only"
                            type="file"
                            accept={DOCUMENT_FILE_ACCEPT}
                            disabled={isUploading}
                            onClick={(event) => {
                                /*
                                 * 允许用户连续选择同一个文件。
                                 */
                                event.currentTarget.value =
                                    "";
                            }}
                            onChange={
                                handleFileInputChange
                            }
                        />

                        <button
                            aria-describedby={
                                uploadHelpId
                            }
                            className={cn(
                                [
                                    "flex w-full flex-col",
                                    "items-center justify-center",
                                    "rounded-2xl border-2",
                                    "border-dashed px-5 py-10",
                                    "text-center",
                                    "transition-colors",
                                    "focus-visible:outline-2",
                                    "focus-visible:outline-offset-2",
                                    "focus-visible:outline-brand-600",
                                    "disabled:cursor-not-allowed",
                                    "disabled:opacity-60",
                                ],
                                isDragging
                                    ? [
                                        "border-brand-600",
                                        "bg-brand-50",
                                    ]
                                    : [
                                        "border-line",
                                        "bg-canvas",
                                        "hover:border-brand-300",
                                        "hover:bg-brand-50/40",
                                    ],
                            )}
                            disabled={isUploading}
                            onClick={() => {
                                fileInputRef.current?.click();
                            }}
                            onDragEnter={
                                handleDragEnter
                            }
                            onDragOver={
                                handleDragOver
                            }
                            onDragLeave={
                                handleDragLeave
                            }
                            onDrop={handleDrop}
                            type="button"
                        >
              <span
                  className={cn(
                      [
                          "grid size-12",
                          "place-items-center",
                          "rounded-2xl",
                      ],
                      isDragging
                          ? "bg-brand-100 text-brand-800"
                          : "bg-surface text-brand-700",
                  )}
                  aria-hidden="true"
              >
                <CloudUpload className="size-6" />
              </span>

                            <span className="mt-4 text-sm font-semibold text-text-primary">
                {isDragging
                    ? "Drop the file here"
                    : "Choose or drag a document"}
              </span>

                            <span
                                id={uploadHelpId}
                                className="mt-2 max-w-md text-xs leading-5 text-text-muted"
                            >
                PDF and DOCX files only.
                Maximum file size: 40 MB.
                Upload one file at a time.
              </span>
                        </button>
                    </div>

                    {selectedFile ? (
                        <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
              <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
                  aria-hidden="true"
              >
                <FileText className="size-5" />
              </span>

                            <div className="min-w-0 flex-1">
                                <p
                                    className="break-words text-sm font-medium text-text-primary"
                                    title={selectedFile.name}
                                >
                                    {selectedFile.name}
                                </p>

                                <p className="mt-1 text-xs text-text-muted">
                                    {selectedFileFormat} ·{" "}
                                    {formatFileSize(
                                        selectedFile.size,
                                    )}
                                </p>
                            </div>

                            <Button
                                aria-label={`Remove ${selectedFile.name}`}
                                disabled={isUploading}
                                onClick={
                                    clearSelectedFile
                                }
                                size="icon"
                                variant="ghost"
                            >
                                <X
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </Button>
                        </div>
                    ) : null}

                    <DocumentTypeSelect
                        id={documentTypeId}
                        value={documentType}
                        disabled={isUploading}
                        onValueChange={
                            setDocumentType
                        }
                    />

                    {isUploading ? (
                        <div
                            className="rounded-xl border border-brand-200 bg-brand-50 p-4"
                            aria-live="polite"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <LoaderCircle
                                        className="size-4 shrink-0 animate-spin text-brand-700"
                                        aria-hidden="true"
                                    />

                                    <p className="truncate text-sm font-medium text-brand-900">
                                        {displayedProgress >= 100
                                            ? "Waiting for the server response"
                                            : "Uploading document"}
                                    </p>
                                </div>

                                <span className="text-sm font-semibold text-brand-900">
                  {displayedProgress}%
                </span>
                            </div>

                            <div
                                className="mt-3 h-2 overflow-hidden rounded-full bg-brand-100"
                                role="progressbar"
                                aria-label="Document upload progress"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={
                                    displayedProgress
                                }
                            >
                                <div
                                    className="h-full rounded-full bg-brand-700 transition-[width]"
                                    style={{
                                        width: `${displayedProgress}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-xs leading-5 text-brand-800">
                                {uploadProgress
                                    ? `${formatFileSize(
                                        uploadProgress.loadedBytes,
                                    )} of ${formatFileSize(
                                        uploadProgress.totalBytes,
                                    )} transferred`
                                    : "Preparing the upload request."}
                            </p>
                        </div>
                    ) : null}

                    <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-5 text-text-muted">
                            Selected category:{" "}
                            <span className="font-medium text-text-secondary">
                {getDocumentTypeLabel(
                    documentType,
                )}
              </span>
                        </p>

                        <Button
                            disabled={
                                !selectedFile ||
                                isUploading
                            }
                            size="lg"
                            type="submit"
                        >
                            {isUploading ? (
                                <LoaderCircle
                                    className="size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Upload
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            )}

                            {isUploading
                                ? "Uploading..."
                                : "Upload document"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}