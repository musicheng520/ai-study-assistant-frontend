export const queryKeys = {
    system: {
        all: ["system"] as const,

        health: () => [...queryKeys.system.all, "health"] as const,
    },

    auth: {
        all: ["auth"] as const,

        me: () => [...queryKeys.auth.all, "me"] as const,
    },

    courses: {
        all: ["courses"] as const,

        lists: () => [...queryKeys.courses.all, "list"] as const,

        list: () => [...queryKeys.courses.lists()] as const,

        details: () => [...queryKeys.courses.all, "detail"] as const,

        detail: (courseId: number) =>
            [...queryKeys.courses.details(), courseId] as const,

        dashboard: (courseId: number) =>
            [...queryKeys.courses.detail(courseId), "dashboard"] as const,

        overview: (courseId: number) =>
            [...queryKeys.courses.detail(courseId), "overview"] as const,
    },

    documents: {
        all: ["documents"] as const,

        lists: () =>
            [...queryKeys.documents.all, "list"] as const,

        list: (courseId: number) =>
            [
                ...queryKeys.documents.lists(),
                {
                    courseId,
                },
            ] as const,

        details: () =>
            [...queryKeys.documents.all, "detail"] as const,

        detail: (documentId: number) =>
            [
                ...queryKeys.documents.details(),
                documentId,
            ] as const,

        status: (documentId: number) =>
            [
                ...queryKeys.documents.detail(documentId),
                "status",
            ] as const,
    },
    chat: {
        all: ["chat"] as const,

        sessions: () =>
            [...queryKeys.chat.all, "sessions"] as const,

        sessionList: (
            courseId: number,
            params: {
                limit: number;
                offset: number;
            },
        ) =>
            [
                ...queryKeys.chat.sessions(),
                {
                    courseId,
                    ...params,
                },
            ] as const,

        sessionDetails: () =>
            [...queryKeys.chat.all, "session-detail"] as const,

        sessionDetail: (sessionId: number) =>
            [
                ...queryKeys.chat.sessionDetails(),
                sessionId,
            ] as const,

        sourceChunks: () =>
            [...queryKeys.chat.all, "source-chunks"] as const,

        sourceChunk: (
            courseId: number,
            chunkId: number,
        ) =>
            [
                ...queryKeys.chat.sourceChunks(),
                {
                    courseId,
                    chunkId,
                },
            ] as const,
    },
    summaries: {
        all: ["summaries"] as const,

        lists: () =>
            [...queryKeys.summaries.all, "list"] as const,

        list: (courseId: number) =>
            [
                ...queryKeys.summaries.lists(),
                { courseId },
            ] as const,

        drafts: () =>
            [...queryKeys.summaries.all, "draft"] as const,

        courseDraft: (
            courseId: number,
            params: {
                topK?: number;
                retrievalQuery?: string;
            },
        ) =>
            [
                ...queryKeys.summaries.drafts(),
                "course",
                {
                    courseId,
                    ...params,
                },
            ] as const,

        documentDraft: (
            documentId: number,
            params: {
                topK?: number;
                retrievalQuery?: string;
            },
        ) =>
            [
                ...queryKeys.summaries.drafts(),
                "document",
                {
                    documentId,
                    ...params,
                },
            ] as const,
    },
    quizzes: {
        all: ["quizzes"] as const,

        lists: () =>
            [...queryKeys.quizzes.all, "list"] as const,

        list: (courseId: number) =>
            [
                ...queryKeys.quizzes.lists(),
                { courseId },
            ] as const,

        details: () =>
            [...queryKeys.quizzes.all, "detail"] as const,

        detail: (quizId: number) =>
            [
                ...queryKeys.quizzes.details(),
                quizId,
            ] as const,

        attempts: (quizId: number) =>
            [
                ...queryKeys.quizzes.detail(quizId),
                "attempts",
            ] as const,

        drafts: () =>
            [...queryKeys.quizzes.all, "draft"] as const,

        courseDraft: (
            courseId: number,
            params: {
                topK?: number;
                retrievalQuery?: string;
                mcqCount?: number;
                shortAnswerCount?: number;
                difficulty?: string;
            },
        ) =>
            [
                ...queryKeys.quizzes.drafts(),
                "course",
                {
                    courseId,
                    ...params,
                },
            ] as const,

        documentDraft: (
            documentId: number,
            params: {
                topK?: number;
                retrievalQuery?: string;
                mcqCount?: number;
                shortAnswerCount?: number;
                difficulty?: string;
            },
        ) =>
            [
                ...queryKeys.quizzes.drafts(),
                "document",
                {
                    documentId,
                    ...params,
                },
            ] as const,
    },
    flashcards: {
        all: ["flashcards"] as const,

        lists: () =>
            [...queryKeys.flashcards.all, "list"] as const,

        list: (courseId: number) =>
            [
                ...queryKeys.flashcards.lists(),
                { courseId },
            ] as const,

        drafts: () =>
            [...queryKeys.flashcards.all, "draft"] as const,

        courseDraft: (
            courseId: number,
            params: {
                topK?: number;
                retrievalQuery?: string;
                count?: number;
                difficulty?: string;
            },
        ) =>
            [
                ...queryKeys.flashcards.drafts(),
                "course",
                {
                    courseId,
                    ...params,
                },
            ] as const,

        documentDraft: (
            documentId: number,
            params: {
                topK?: number;
                retrievalQuery?: string;
                count?: number;
                difficulty?: string;
            },
        ) =>
            [
                ...queryKeys.flashcards.drafts(),
                "document",
                {
                    documentId,
                    ...params,
                },
            ] as const,

        weakTopicDraft: (
            courseId: number,
            params: {
                topicLimit?: number;
                cardsPerTopic?: number;
                difficulty?: string;
                topK?: number;
            },
        ) =>
            [
                ...queryKeys.flashcards.drafts(),
                "weak-topics",
                {
                    courseId,
                    ...params,
                },
            ] as const,
    },
} as const;