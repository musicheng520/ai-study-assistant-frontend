export type AiFeedbackTargetType =
    | "ANSWER"
    | "SUMMARY"
    | "QUIZ"
    | "FLASHCARD"
    | "ASSIGNMENT_ANALYSIS"
    | "RUBRIC_ANALYSIS"
    | "REVISION_PACK";

export type AiFeedbackRating =
    | "HELPFUL"
    | "NOT_HELPFUL"
    | "INACCURATE";

export type AiFeedbackCreateRequest = {
    courseId: number;
    targetType: AiFeedbackTargetType;
    targetId: number;
    rating: AiFeedbackRating;
    comment?: string | null;
};

export type AiFeedbackResponse = {
    id: number;
    courseId: number;
    targetType: AiFeedbackTargetType;
    targetId: number;
    rating: AiFeedbackRating;
    comment: string | null;
    createdAt: string;
};