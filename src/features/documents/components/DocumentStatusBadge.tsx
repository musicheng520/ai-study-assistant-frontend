import {
    CheckCircle2,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";

import { Badge } from "@/components/ui";
import {
    getDocumentStatusLabel,
    type DocumentStatus,
} from "@/features/documents/model";

type DocumentStatusBadgeProps = {
    status: DocumentStatus;
};

export function DocumentStatusBadge({
                                        status,
                                    }: DocumentStatusBadgeProps) {
    if (status === "READY") {
        return (
            <Badge variant="success">
                <CheckCircle2
                    className="size-3.5"
                    aria-hidden="true"
                />
                {getDocumentStatusLabel(status)}
            </Badge>
        );
    }

    if (status === "FAILED") {
        return (
            <Badge variant="destructive">
                <CircleAlert
                    className="size-3.5"
                    aria-hidden="true"
                />
                {getDocumentStatusLabel(status)}
            </Badge>
        );
    }

    return (
        <Badge variant="warning">
            <LoaderCircle
                className="size-3.5 animate-spin"
                aria-hidden="true"
            />
            {getDocumentStatusLabel(status)}
        </Badge>
    );
}