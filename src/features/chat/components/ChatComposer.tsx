import {
    Send,
} from "lucide-react";
import {
    useId,
    useState,
    type KeyboardEvent,
} from "react";

import {
    Button,
} from "@/components/ui";

type ChatComposerProps = {
    disabled?: boolean;
    isSubmitting: boolean;
    placeholder?: string;
    submitLabel?: string;
    onSubmit: (
        question: string,
    ) => Promise<void> | void;
};

export function ChatComposer({
                                 disabled = false,
                                 isSubmitting,
                                 placeholder = "Ask a question about your course materials...",
                                 submitLabel = "Send",
                                 onSubmit,
                             }: ChatComposerProps) {
    const textareaId = useId();

    const [
        question,
        setQuestion,
    ] = useState("");

    const trimmedQuestion =
        question.trim();

    const canSubmit =
        !disabled &&
        !isSubmitting &&
        trimmedQuestion.length > 0;

    async function handleSubmit() {
        if (!canSubmit) {
            return;
        }

        const submittedQuestion =
            trimmedQuestion;

        setQuestion("");

        try {
            await onSubmit(submittedQuestion);
        } catch {
            setQuestion(submittedQuestion);
        }
    }

    function handleKeyDown(
        event: KeyboardEvent<HTMLTextAreaElement>,
    ) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            void handleSubmit();
        }
    }

    return (
        <form
            className="border-t border-line bg-surface px-5 py-4 sm:px-6"
            onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit();
            }}
        >
            <label
                htmlFor={textareaId}
                className="sr-only"
            >
                Ask a question
            </label>

            <div className="rounded-2xl border border-line bg-background p-2 shadow-sm focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
                <textarea
                    id={textareaId}
                    value={question}
                    onChange={(event) => {
                        setQuestion(
                            event.target.value,
                        );
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={
                        disabled || isSubmitting
                    }
                    placeholder={placeholder}
                    rows={3}
                    className={[
                        "block w-full resize-none",
                        "rounded-xl border-0 bg-transparent px-3 py-2",
                        "text-sm leading-6 text-text-primary",
                        "placeholder:text-text-muted",
                        "focus:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                    ].join(" ")}
                />

                <div className="flex items-center justify-between gap-3 px-1 pb-1">
                    <p className="text-xs text-text-muted">
                        Enter to send · Shift + Enter for new line
                    </p>

                    <Button
                        type="submit"
                        size="sm"
                        disabled={!canSubmit}
                    >
                        <Send
                            className="size-4"
                            aria-hidden="true"
                        />

                        {isSubmitting
                            ? "Sending..."
                            : submitLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
}