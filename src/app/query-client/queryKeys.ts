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
} as const;