export type ChatRole =
    | "USER"
    | "ASSISTANT";

export type ChatScopeType =
    | "COURSE"
    | "DOCUMENT";

export type ChatWorkflowType =
    | "RAG_QA"
    | "SUMMARY"
    | "QUIZ"
    | "FLASHCARD"
    | "ASSIGNMENT_ANALYSIS"
    | "RUBRIC_ANALYSIS"
    | "REVISION_PLAN"
    | "UNKNOWN";

export type ChatCitation = {
    id?: number;
    citationIndex?: number;
    messageId?: number;
    documentId: number;
    chunkId: number;
    fileName: string;
    pageNumber: number | null;
    sectionTitle: string | null;
    snippet: string;
    distance?: number | null;
    createdAt?: string;
};

export type ChatSessionSummary = {
    id: number;
    courseId: number;
    title: string;
    scopeType: ChatScopeType;
    documentId: number | null;
    messageCount?: number;
    lastMessagePreview?: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ChatMessage = {
    id: number;
    sessionId: number;
    userId?: number;
    courseId: number;
    role: ChatRole;
    content: string;
    workflowType: ChatWorkflowType | string;
    noAnswer: boolean;
    modelName?: string | null;
    citations: ChatCitation[];
    createdAt: string;
};

export type ChatSessionDetail = {
    id: number;
    courseId: number;
    title: string;
    scopeType: ChatScopeType;
    documentId: number | null;
    createdAt: string;
    updatedAt: string;
    messages: ChatMessage[];
};

export type ChatSessionListResponse = {
    courseId: number;
    limit: number;
    offset: number;
    count: number;
    sessions: ChatSessionSummary[];
};

export type AskCourseQuestionRequest = {
    question: string;
    sessionId?: number | null;
    topK?: number;
};

export type RagAskResponse = {
    sessionId: number;
    userMessageId: number;
    assistantMessageId: number;
    answer: string;
    noAnswer: boolean;
    workflowType: ChatWorkflowType | string;
    retrievedChunkCount: number;
    citations: ChatCitation[];
};

export type SourceChunk = {
    chunkId: number;
    userId: number;
    courseId: number;
    documentId: number;
    chunkIndex: number;
    content: string;
    contentHash: string;
    pageNumber: number | null;
    sectionTitle: string | null;
    tokenCount: number;
    vectorKey: string;
    vectorStatus: string;
    embeddingModel: string;
    embeddingDimension: number;
    fileName: string;
    fileType: string;
    documentType: string;
    createdAt: string;
};

export type SaveAnswerResponse = {
    id?: number;
    savedAnswerId?: number;
    message?: string;
};

/**
 * Compatibility aliases.
 * Keep these names because older local files may import them.
 */
export type RagCitation = ChatCitation;

export type SourceChunkResponse = SourceChunk;