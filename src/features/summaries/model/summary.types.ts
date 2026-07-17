export type SummarySourceScope =
    | "COURSE"
    | "DOCUMENT";

export type SummaryGenerateRequest = {
    topK?: number;
    retrievalQuery?: string;
};

export type SummaryKeyConcept = {
    name: string;
    explanation: string;
};

export type SummaryDefinition = {
    term: string;
    definition: string;
};

export type SummaryGenerateResponse = {
    draftKey: string;
    title: string;
    summary: string;
    keyConcepts: SummaryKeyConcept[];
    definitions: SummaryDefinition[];
    revisionNotes: string;
    sourceScope: SummarySourceScope;
};

export type SaveDraftRequest = {
    draftKey: string;
};

export type SummarySaveResponse = {
    summaryId: number;
};

export type SavedSummary = {
    id: number;
    userId?: number;
    courseId: number;
    documentId: number | null;
    title: string;
    summary: string;
    keyConcepts: SummaryKeyConcept[];
    definitions: SummaryDefinition[];
    revisionNotes: string;
    sourceScope: SummarySourceScope;
    createdAt: string;
};

export type SummaryDeleteResponse = {
    deleted: boolean;
    summaryId: number;
};