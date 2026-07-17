export type QuizDifficulty =
    | "EASY"
    | "MEDIUM"
    | "HARD";

export type QuizSourceScope =
    | "COURSE"
    | "DOCUMENT"
    | "WEAK_TOPIC";

export type QuizQuestionType =
    | "MCQ"
    | "SHORT_ANSWER";

export type QuizGenerateRequest = {
    topK?: number;
    retrievalQuery?: string;
    mcqCount?: number;
    shortAnswerCount?: number;
    difficulty?: QuizDifficulty;
};

export type QuizDraftQuestion = {
    questionType: QuizQuestionType;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: QuizDifficulty;
    topic: string;
    sourceChunkId: number | null;
};

export type QuizGenerateResponse = {
    draftKey: string;
    title: string;
    difficulty: QuizDifficulty;
    sourceScope: QuizSourceScope;
    questionCount: number;
    questions: QuizDraftQuestion[];
};

export type QuizSaveDraftRequest = {
    draftKey: string;
};

export type QuizSaveResponse = {
    quizId: number;
};

export type SavedQuiz = {
    id: number;
    userId?: number;
    courseId: number;
    documentId: number | null;
    title: string;
    difficulty: QuizDifficulty;
    sourceScope: QuizSourceScope;
    questionCount: number;
    createdAt: string;
};

export type QuizDeleteResponse = {
    deleted: boolean;
    quizId: number;
};