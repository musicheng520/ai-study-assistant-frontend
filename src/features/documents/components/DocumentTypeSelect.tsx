import {
    documentTypeValues,
    getDocumentTypeLabel,
    type DocumentType,
} from "@/features/documents/model";

type DocumentTypeSelectProps = {
    id: string;
    value: DocumentType;
    disabled?: boolean;
    onValueChange: (
        value: DocumentType,
    ) => void;
};

export function DocumentTypeSelect({
                                       id,
                                       value,
                                       disabled = false,
                                       onValueChange,
                                   }: DocumentTypeSelectProps) {
    return (
        <div>
            <label
                className="text-sm font-medium text-text-primary"
                htmlFor={id}
            >
                Document type
            </label>

            <select
                id={id}
                className={[
                    "mt-2 h-11 w-full",
                    "rounded-lg border border-line",
                    "bg-surface px-3",
                    "text-sm text-text-primary",
                    "outline-none transition-colors",
                    "hover:border-slate-300",
                    "focus:border-brand-600",
                    "focus:ring-2",
                    "focus:ring-brand-100",
                    "disabled:cursor-not-allowed",
                    "disabled:bg-surface-muted",
                    "disabled:opacity-70",
                ].join(" ")}
                disabled={disabled}
                value={value}
                onChange={(event) => {
                    onValueChange(
                        event.target.value as DocumentType,
                    );
                }}
            >
                {documentTypeValues.map(
                    (documentType) => (
                        <option
                            key={documentType}
                            value={documentType}
                        >
                            {getDocumentTypeLabel(
                                documentType,
                            )}
                        </option>
                    ),
                )}
            </select>

            <p className="mt-2 text-xs leading-5 text-text-muted">
                Choose the category that best describes
                how this file will be used.
            </p>
        </div>
    );
}