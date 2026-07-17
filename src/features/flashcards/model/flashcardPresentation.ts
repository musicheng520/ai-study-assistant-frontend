import type {
    FlashcardReviewState,
    FlashcardSourceType,
} from "./flashcard.types";

export function isWeakTopicFlashcardSource(
    sourceType: FlashcardSourceType | string,
) {
    return (
        sourceType === "WEAK_TOPIC" ||
        sourceType === "WEAK_TOPICS" ||
        sourceType === "WRONG_TOPIC" ||
        sourceType === "WRONG_TOPICS" ||
        sourceType === "QUIZ_WRONG_TOPIC"
    );
}

export function getFlashcardSourceLabel(
    sourceType: FlashcardSourceType | string,
) {
    if (sourceType === "QUIZ_WRONG_TOPIC") {
        return "QUIZ WRONG TOPIC";
    }

    if (
        sourceType === "WEAK_TOPIC" ||
        sourceType === "WEAK_TOPICS" ||
        sourceType === "WRONG_TOPIC" ||
        sourceType === "WRONG_TOPICS"
    ) {
        return "WEAK TOPIC";
    }

    return sourceType;
}

export function formatFlashcardInterval(
    minutes: number,
) {
    if (minutes < 60) {
        return `${minutes} min`;
    }

    if (minutes < 1_440) {
        return `${Math.round(minutes / 60)} hr`;
    }

    return `${Math.round(minutes / 1_440)} day`;
}

export function getFlashcardReviewSummary(
    state: FlashcardReviewState | undefined,
) {
    if (!state) {
        return "Not reviewed";
    }

    return `${state.lastRating} · ${formatFlashcardInterval(
        state.intervalMinutes,
    )}`;
}