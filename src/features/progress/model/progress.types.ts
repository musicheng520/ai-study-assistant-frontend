export type ProgressActivity = {
    id?: number;
    eventType: string;
    targetType: string;
    targetId: number | null;
    topic: string | null;
    title: string;
    iconType?: string;
    createdAt: string;
};

export type UserProgressOverview = {
    courseCount: number;
    documentCount: number;
    readyDocumentCount: number;
    questionAskedCount: number;
    summaryCount: number;
    quizCount: number;
    flashcardCount: number;
    averageQuizScore: number | null;
    currentStreak: number;
    longestStreak: number;
    recentActivity: ProgressActivity[];
};

export type CourseWeakTopic = {
    topic: string;
    wrongCount: number;
    resolvedCount: number;
    unresolvedCount: number;
    lastWrongAt: string | null;
    relatedQuizCount: number;
};

export type CourseProgress = {
    courseId: number;
    documentCount: number;
    readyDocumentCount: number;
    chatMessageCount: number;
    summaryCount: number;
    quizCount: number;
    quizAttemptCount: number;
    averageQuizScore: number | null;
    wrongAnswerCount: number;
    unresolvedWrongAnswerCount: number;
    flashcardCount: number;
    noteCount: number;
    progressScore: number;
    weakTopics: CourseWeakTopic[];
    recommendedNextReview: string | null;
    recentActivity: ProgressActivity[];
};

export type CourseWeakTopicsResponse = {
    courseId: number;
    topicCount: number;
    weakTopics: CourseWeakTopic[];
};

export type CourseReviewRecommendation = {
    type: string;
    topic: string | null;
    quizId: number | null;
    documentId: number | null;
    reason: string;
    priority: number;
    action: string;
};

export type CourseReviewRecommendationsResponse = {
    courseId: number;
    count: number;
    recommendations: CourseReviewRecommendation[];
};