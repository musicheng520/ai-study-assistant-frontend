export type FlashcardDifficulty =
    | "EASY"
    | "MEDIUM"
    | "HARD";

export type FlashcardSourceType =
    | "COURSE"
    | "DOCUMENT"
    | "WEAK_TOPIC"
    | "WEAK_TOPICS"
    | "WRONG_TOPIC"
    | "WRONG_TOPICS"
    | "QUIZ_WRONG_TOPIC";

export type FlashcardGenerateRequest = {
    topK?: number;
    retrievalQuery?: string;
    count?: number;
    difficulty?: FlashcardDifficulty;
};

export type WrongTopicFlashcardGenerateRequest = {
    topicLimit?: number;
    cardsPerTopic?: number;
    difficulty?: FlashcardDifficulty;
    topK?: number;
};

export type FlashcardDraftCard = {
    front: string;
    back: string;
    topic: string;
    difficulty: FlashcardDifficulty;
    sourceChunkId: number | null;
};

export type FlashcardGenerateResponse = {
    draftKey: string;
    title: string;
    sourceScope?: FlashcardSourceType;
    sourceType?: FlashcardSourceType;
    count: number;
    difficulty: FlashcardDifficulty;
    topics: string[];
    weakTopics?: string[];
    cards: FlashcardDraftCard[];
};

export type WeakTopicFlashcardGenerateResponse =
    FlashcardGenerateResponse & {
    weakTopics?: string[];
};

export type FlashcardSaveDraftRequest = {
    draftKey: string;
};

export type FlashcardSaveResponse = {
    savedCount: number;
    flashcardIds: number[];
};

export type SavedFlashcard = {
    id: number;
    userId?: number;
    courseId: number;
    documentId: number | null;
    front: string;
    back: string;
    topic: string;
    difficulty: FlashcardDifficulty;
    sourceType: FlashcardSourceType;
    sourceChunkId: number | null;
    createdAt: string;
};

export type FlashcardDeleteResponse = {
    deleted: boolean;
    flashcardId: number;
};

export type FlashcardReviewRating =
    | "AGAIN"
    | "GOOD"
    | "EASY";

export type FlashcardReviewState = {
    flashcardId: number;
    intervalMinutes: number;
    dueAt: string;
    lastReviewedAt: string;
    lastRating: FlashcardReviewRating;
    reviewCount: number;
    againCount: number;
    goodCount: number;
    easyCount: number;
};