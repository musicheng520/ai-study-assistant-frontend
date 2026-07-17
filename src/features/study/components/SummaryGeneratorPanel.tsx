import {
    Check,
    FileText,
    RefreshCcw,
    Save,
    Sparkles,
} from "lucide-react";
import {
    useState,
} from "react";

import {
    Badge,
    Button,
    Card,
} from "@/components/ui";
import {
    useGenerateCourseSummaryMutation,
    useSaveSummaryDraftMutation,
} from "@/features/summaries";
import type {
    SummaryGenerateResponse,
} from "@/features/summaries";
import { toApiError } from "@/lib/errors/ApiError";

type SummaryGeneratorPanelProps = {
    courseId: number;
};

export function SummaryGeneratorPanel({
                                          courseId,
                                      }: SummaryGeneratorPanelProps) {
    const generateMutation =
        useGenerateCourseSummaryMutation();

    const saveMutation =
        useSaveSummaryDraftMutation();

    const [
        topK,
        setTopK,
    ] = useState(3);

    const [
        retrievalQuery,
        setRetrievalQuery,
    ] = useState("");

    const [
        draft,
        setDraft,
    ] = useState<SummaryGenerateResponse | null>(
        null,
    );

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        savedSummaryId,
        setSavedSummaryId,
    ] = useState<number | null>(null);

    async function handleGenerate() {
        setErrorMessage(null);
        setSavedSummaryId(null);

        try {
            const response =
                await generateMutation.mutateAsync({
                    courseId,
                    request: {
                        topK,
                        retrievalQuery:
                            retrievalQuery.trim() ||
                            undefined,
                    },
                });

            setDraft(response);
        } catch (error) {
            const apiError =
                toApiError(error);

            setErrorMessage(apiError.message);
        }
    }

    async function handleSaveDraft() {
        if (!draft) {
            return;
        }

        setErrorMessage(null);

        try {
            const response =
                await saveMutation.mutateAsync({
                    draftKey: draft.draftKey,
                });

            setSavedSummaryId(
                response.summaryId,
            );
        } catch (error) {
            const apiError =
                toApiError(error);

            setErrorMessage(apiError.message);
        }
    }

    const isGenerating =
        generateMutation.isPending;

    const isSaving =
        saveMutation.isPending;

    return (
        <Card className="overflow-hidden">
            <div className="border-b border-line px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                            <Sparkles
                                className="size-4"
                                aria-hidden="true"
                            />
                            Summary generator
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-text-primary">
                            Generate course summary
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                            Generate a draft summary from the
                            course&apos;s READY documents. The
                            draft is temporary until you save it.
                        </p>
                    </div>

                    <Badge variant="info">
                        Draft first
                    </Badge>
                </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="summary-top-k"
                            className="text-sm font-medium text-text-primary"
                        >
                            Retrieved chunks
                        </label>

                        <select
                            id="summary-top-k"
                            value={topK}
                            onChange={(event) => {
                                setTopK(
                                    Number(
                                        event.target.value,
                                    ),
                                );
                            }}
                            disabled={
                                isGenerating || isSaving
                            }
                            className={[
                                "mt-2 h-10 w-full rounded-lg",
                                "border border-line bg-surface px-3",
                                "text-sm text-text-primary",
                                "focus:border-brand-300",
                                "focus:outline-none",
                                "focus:ring-2",
                                "focus:ring-brand-100",
                                "disabled:cursor-not-allowed",
                                "disabled:opacity-60",
                            ].join(" ")}
                        >
                            <option value={1}>
                                1 chunk
                            </option>
                            <option value={3}>
                                3 chunks
                            </option>
                            <option value={5}>
                                5 chunks
                            </option>
                            <option value={8}>
                                8 chunks
                            </option>
                        </select>

                        <p className="mt-1 text-xs leading-5 text-text-muted">
                            Higher values give more context but
                            may be slower.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="summary-query"
                            className="text-sm font-medium text-text-primary"
                        >
                            Focus query
                        </label>

                        <textarea
                            id="summary-query"
                            value={retrievalQuery}
                            onChange={(event) => {
                                setRetrievalQuery(
                                    event.target.value,
                                );
                            }}
                            disabled={
                                isGenerating || isSaving
                            }
                            rows={4}
                            placeholder="Optional. Example: focus on exam definitions and key concepts."
                            className={[
                                "mt-2 w-full resize-none rounded-xl",
                                "border border-line bg-surface px-3 py-2",
                                "text-sm leading-6 text-text-primary",
                                "placeholder:text-text-muted",
                                "focus:border-brand-300",
                                "focus:outline-none",
                                "focus:ring-2",
                                "focus:ring-brand-100",
                                "disabled:cursor-not-allowed",
                                "disabled:opacity-60",
                            ].join(" ")}
                        />
                    </div>

                    {errorMessage ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                            {errorMessage}
                        </div>
                    ) : null}

                    {savedSummaryId ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
                            Summary saved. ID:{" "}
                            {savedSummaryId}
                        </div>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                        <Button
                            disabled={
                                isGenerating || isSaving
                            }
                            onClick={() => {
                                void handleGenerate();
                            }}
                        >
                            {isGenerating ? (
                                <RefreshCcw
                                    className="size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Sparkles
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            )}

                            {isGenerating
                                ? "Generating..."
                                : draft
                                    ? "Regenerate"
                                    : "Generate"}
                        </Button>

                        <Button
                            variant="secondary"
                            disabled={
                                !draft ||
                                isGenerating ||
                                isSaving ||
                                savedSummaryId !== null
                            }
                            onClick={() => {
                                void handleSaveDraft();
                            }}
                        >
                            {savedSummaryId ? (
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

                            {isSaving
                                ? "Saving..."
                                : savedSummaryId
                                    ? "Saved"
                                    : "Save draft"}
                        </Button>
                    </div>
                </div>

                <div className="min-w-0">
                    {!draft ? (
                        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-line bg-surface-muted p-6 text-center">
                            <div className="max-w-md">
                                <div className="mx-auto grid size-12 place-items-center rounded-full bg-ai-50 text-ai-700">
                                    <FileText
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-text-primary">
                                    No summary draft yet
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    Configure the retrieval
                                    settings and generate a draft.
                                    The result will appear here
                                    before saving.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5 rounded-2xl border border-line bg-surface p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <Badge variant="warning">
                                        Unsaved Draft
                                    </Badge>

                                    <h3 className="mt-3 text-lg font-semibold text-text-primary">
                                        {draft.title}
                                    </h3>

                                    <p className="mt-1 text-xs text-text-muted">
                                        Source scope:{" "}
                                        {draft.sourceScope}
                                    </p>
                                </div>
                            </div>

                            <section>
                                <h4 className="text-sm font-semibold text-text-primary">
                                    Summary
                                </h4>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                                    {draft.summary}
                                </p>
                            </section>

                            {draft.keyConcepts.length > 0 ? (
                                <section>
                                    <h4 className="text-sm font-semibold text-text-primary">
                                        Key concepts
                                    </h4>

                                    <div className="mt-3 space-y-3">
                                        {draft.keyConcepts.map(
                                            (concept) => (
                                                <div
                                                    key={
                                                        concept.name
                                                    }
                                                    className="rounded-xl border border-line bg-surface-muted p-3"
                                                >
                                                    <p className="text-sm font-medium text-text-primary">
                                                        {
                                                            concept.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                                                        {
                                                            concept.explanation
                                                        }
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </section>
                            ) : null}

                            {draft.definitions.length > 0 ? (
                                <section>
                                    <h4 className="text-sm font-semibold text-text-primary">
                                        Definitions
                                    </h4>

                                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                                        {draft.definitions.map(
                                            (definition) => (
                                                <div
                                                    key={
                                                        definition.term
                                                    }
                                                    className="rounded-xl border border-line p-3"
                                                >
                                                    <p className="text-sm font-medium text-text-primary">
                                                        {
                                                            definition.term
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                                                        {
                                                            definition.definition
                                                        }
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </section>
                            ) : null}

                            {draft.revisionNotes ? (
                                <section>
                                    <h4 className="text-sm font-semibold text-text-primary">
                                        Revision notes
                                    </h4>

                                    <p className="mt-2 whitespace-pre-wrap rounded-xl bg-brand-50 p-3 text-sm leading-6 text-brand-900">
                                        {draft.revisionNotes}
                                    </p>
                                </section>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}