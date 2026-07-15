import {
    useMemo,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router";

import { Card } from "@/components/ui";

import { useCourseChatSessionsQuery } from "../api";
import { ChatSessionList } from "./ChatSessionList";

function parseRouteNumber(
    value: string | undefined,
): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);

    if (
        !Number.isInteger(parsed) ||
        parsed <= 0
    ) {
        return null;
    }

    return parsed;
}

export function ChatWorkspace() {
    const params = useParams();
    const navigate = useNavigate();

    const courseId = useMemo(
        () => parseRouteNumber(params.courseId),
        [params.courseId],
    );

    const selectedSessionId = useMemo(
        () => parseRouteNumber(params.sessionId),
        [params.sessionId],
    );

    const sessionsQuery =
        useCourseChatSessionsQuery(courseId, {
            limit: 20,
            offset: 0,
        });

    if (courseId === null) {
        return (
            <Card className="p-6">
                <h1 className="text-lg font-semibold text-text-primary">
                    Invalid course route
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                    The course ID in this URL is not valid.
                </p>
            </Card>
        );
    }

    function handleNewChat() {
        navigate(`/courses/${courseId}/chat`);
    }

    function handleSelectSession(
        sessionId: number,
    ) {
        navigate(
            `/courses/${courseId}/chat/${sessionId}`,
        );
    }

    return (
        <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <aside className="hidden lg:block">
                <ChatSessionList
                    sessions={
                        sessionsQuery.data?.sessions ??
                        []
                    }
                    selectedSessionId={
                        selectedSessionId
                    }
                    isLoading={
                        sessionsQuery.isPending
                    }
                    isError={sessionsQuery.isError}
                    onRetry={() => {
                        void sessionsQuery.refetch();
                    }}
                    onNewChat={handleNewChat}
                    onSelectSession={
                        handleSelectSession
                    }
                    variant="sidebar"
                />
            </aside>

            <div className="lg:hidden">
                <ChatSessionList
                    sessions={
                        sessionsQuery.data?.sessions ??
                        []
                    }
                    selectedSessionId={
                        selectedSessionId
                    }
                    isLoading={
                        sessionsQuery.isPending
                    }
                    isError={sessionsQuery.isError}
                    onRetry={() => {
                        void sessionsQuery.refetch();
                    }}
                    onNewChat={handleNewChat}
                    onSelectSession={
                        handleSelectSession
                    }
                    variant="compact"
                />
            </div>

            <Card className="min-h-[520px] overflow-hidden">
                <header className="border-b border-line px-5 py-4 sm:px-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        AI Chat
                    </p>

                    <h1 className="mt-1 text-xl font-semibold text-text-primary">
                        Ask questions from your course
                        materials
                    </h1>

                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                        Answers will be grounded in READY
                        documents and connected to citations.
                    </p>
                </header>

                <section className="flex min-h-[420px] items-center justify-center px-5 py-10 sm:px-6">
                    {selectedSessionId ? (
                        <div className="max-w-md text-center">
                            <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-800">
                                #{selectedSessionId}
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-text-primary">
                                Chat session selected
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                M61.3 will load this
                                session&apos;s historical messages
                                and citations here.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-md text-center">
                            <div className="mx-auto grid size-12 place-items-center rounded-full bg-ai-50 text-sm font-semibold text-ai-700">
                                AI
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-text-primary">
                                Start a new course chat
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                M61.4 will add the question
                                composer here. For now, choose a
                                previous session or keep this route
                                for a new chat.
                            </p>
                        </div>
                    )}
                </section>
            </Card>
        </div>
    );
}