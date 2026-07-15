import {
    Check,
    Clipboard,
    Copy,
    MessageSquareWarning,
    Save,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react";
import {
    useState,
} from "react";

import {
    Button,
    Dialog,
} from "@/components/ui";
import { useSaveAnswerMutation } from "@/features/chat/api";
import { useCreateAiFeedbackMutation } from "@/features/feedback";
import type {
    AiFeedbackRating,
} from "@/features/feedback";
import { toApiError } from "@/lib/errors/ApiError";

import type { ChatMessage } from "../model";

type ChatMessageActionsProps = {
    courseId: number;
    message: ChatMessage;
};

type CopyState =
    | "idle"
    | "copied"
    | "failed";

export function ChatMessageActions({
                                       courseId,
                                       message,
                                   }: ChatMessageActionsProps) {
    const saveAnswerMutation =
        useSaveAnswerMutation();

    const feedbackMutation =
        useCreateAiFeedbackMutation();

    const [
        copyState,
        setCopyState,
    ] = useState<CopyState>("idle");

    const [
        saved,
        setSaved,
    ] = useState(false);

    const [
        selectedRating,
        setSelectedRating,
    ] = useState<AiFeedbackRating | null>(
        null,
    );

    const [
        actionMessage,
        setActionMessage,
    ] = useState<string | null>(null);

    const [
        inaccurateDialogOpen,
        setInaccurateDialogOpen,
    ] = useState(false);

    const [
        inaccurateComment,
        setInaccurateComment,
    ] = useState("");

    if (message.role !== "ASSISTANT") {
        return null;
    }

    async function handleCopy() {
        setActionMessage(null);

        try {
            await navigator.clipboard.writeText(
                message.content,
            );

            setCopyState("copied");
        } catch {
            setCopyState("failed");
            setActionMessage(
                "Copy failed. Your browser may have blocked clipboard access.",
            );
        }
    }

    async function handleSave() {
        setActionMessage(null);

        try {
            await saveAnswerMutation.mutateAsync({
                messageId: message.id,
            });

            setSaved(true);
            setActionMessage(
                "Answer saved to your learning resources.",
            );
        } catch (error) {
            const apiError =
                toApiError(error);

            setActionMessage(apiError.message);
        }
    }

    async function submitFeedback(
        rating: AiFeedbackRating,
        comment?: string | null,
    ) {
        setActionMessage(null);

        try {
            await feedbackMutation.mutateAsync({
                courseId,
                targetType: "ANSWER",
                targetId: message.id,
                rating,
                comment:
                    comment?.trim() || null,
            });

            setSelectedRating(rating);
            setActionMessage(
                "Feedback submitted. Thank you.",
            );
        } catch (error) {
            const apiError =
                toApiError(error);

            setActionMessage(apiError.message);
        }
    }

    async function handleSubmitInaccurate() {
        await submitFeedback(
            "INACCURATE",
            inaccurateComment,
        );

        setInaccurateDialogOpen(false);
        setInaccurateComment("");
    }

    const actionDisabled =
        saveAnswerMutation.isPending ||
        feedbackMutation.isPending;

    return (
        <div className="mt-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                        void handleCopy();
                    }}
                >
                    {copyState === "copied" ? (
                        <Check
                            className="size-4"
                            aria-hidden="true"
                        />
                    ) : (
                        <Copy
                            className="size-4"
                            aria-hidden="true"
                        />
                    )}

                    {copyState === "copied"
                        ? "Copied"
                        : "Copy"}
                </Button>

                <Button
                    size="sm"
                    variant="ghost"
                    disabled={
                        actionDisabled || saved
                    }
                    onClick={() => {
                        void handleSave();
                    }}
                >
                    {saved ? (
                        <Check
                            className="size-4"
                            aria-hidden="true"
                        />
                    ) : (
                        <Save
                            className="size-4"
                            aria-hidden="true"
                        />
                    )}

                    {saveAnswerMutation.isPending
                        ? "Saving..."
                        : saved
                            ? "Saved"
                            : "Save"}
                </Button>

                <Button
                    size="sm"
                    variant={
                        selectedRating === "HELPFUL"
                            ? "secondary"
                            : "ghost"
                    }
                    disabled={actionDisabled}
                    onClick={() => {
                        void submitFeedback(
                            "HELPFUL",
                        );
                    }}
                >
                    <ThumbsUp
                        className="size-4"
                        aria-hidden="true"
                    />
                    Helpful
                </Button>

                <Button
                    size="sm"
                    variant={
                        selectedRating ===
                        "NOT_HELPFUL"
                            ? "secondary"
                            : "ghost"
                    }
                    disabled={actionDisabled}
                    onClick={() => {
                        void submitFeedback(
                            "NOT_HELPFUL",
                        );
                    }}
                >
                    <ThumbsDown
                        className="size-4"
                        aria-hidden="true"
                    />
                    Not helpful
                </Button>

                <Button
                    size="sm"
                    variant={
                        selectedRating ===
                        "INACCURATE"
                            ? "secondary"
                            : "ghost"
                    }
                    disabled={actionDisabled}
                    onClick={() => {
                        setInaccurateDialogOpen(
                            true,
                        );
                    }}
                >
                    <MessageSquareWarning
                        className="size-4"
                        aria-hidden="true"
                    />
                    Inaccurate
                </Button>
            </div>

            {actionMessage ? (
                <p className="flex items-start gap-2 text-xs leading-5 text-text-muted">
                    <Clipboard
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                    />
                    {actionMessage}
                </p>
            ) : null}

            <Dialog
                open={inaccurateDialogOpen}
                onOpenChange={
                    setInaccurateDialogOpen
                }
                preventClose={
                    feedbackMutation.isPending
                }
                title="Report inaccurate answer"
                description="Optional: explain what seems inaccurate so the feedback is useful."
            >
                <div className="space-y-3 px-5 py-5 sm:px-6">
                    <label
                        htmlFor={`inaccurate-comment-${message.id}`}
                        className="text-sm font-medium text-text-primary"
                    >
                        Comment
                    </label>

                    <textarea
                        id={`inaccurate-comment-${message.id}`}
                        value={inaccurateComment}
                        onChange={(event) => {
                            setInaccurateComment(
                                event.target.value,
                            );
                        }}
                        rows={5}
                        className={[
                            "w-full resize-none rounded-xl",
                            "border border-line bg-surface px-3 py-2",
                            "text-sm leading-6 text-text-primary",
                            "placeholder:text-text-muted",
                            "focus:border-brand-300",
                            "focus:outline-none",
                            "focus:ring-2",
                            "focus:ring-brand-100",
                        ].join(" ")}
                        placeholder="For example: the citation does not support this claim..."
                    />
                </div>

                <footer className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4 sm:px-6">
                    <Button
                        variant="secondary"
                        disabled={
                            feedbackMutation.isPending
                        }
                        onClick={() => {
                            setInaccurateDialogOpen(
                                false,
                            );
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={
                            feedbackMutation.isPending
                        }
                        onClick={() => {
                            void handleSubmitInaccurate();
                        }}
                    >
                        {feedbackMutation.isPending
                            ? "Submitting..."
                            : "Submit feedback"}
                    </Button>
                </footer>
            </Dialog>
        </div>
    );
}