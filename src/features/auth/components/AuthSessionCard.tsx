import {
    CircleUserRound,
    ShieldCheck,
} from "lucide-react";

import {
    ErrorState,
    LoadingState,
} from "@/components/feedback";
import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { useAuth } from "@/features/auth/context";

export function AuthSessionCard() {
    const {
        user,
        status,
        error,
        refreshCurrentUser,
    } = useAuth();

    if (status === "checking") {
        return (
            <LoadingState
                title="Checking session"
                description="Validating the stored session with the backend."
            />
        );
    }

    if (status === "error") {
        return (
            <ErrorState
                title="Session validation failed"
                message={
                    error?.message ??
                    "The current session could not be validated."
                }
                onRetry={() => {
                    void refreshCurrentUser().catch(
                        () => undefined,
                    );
                }}
            />
        );
    }

    if (status === "disabled") {
        return (
            <ErrorState
                title="Account disabled"
                message={
                    error?.message ??
                    "This account cannot access the workspace."
                }
            />
        );
    }

    if (
        status === "unauthenticated" ||
        !user
    ) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        No active session
                    </CardTitle>

                    <CardDescription>
                        Login and registration forms will be
                        connected in M58.3.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
                        <CircleUserRound
                            className="mt-0.5 size-5 shrink-0 text-text-muted"
                            aria-hidden="true"
                        />

                        <p className="text-sm leading-6 text-text-secondary">
                            No JWT is currently stored in this
                            browser session.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <CardTitle>
                            {user.displayName}
                        </CardTitle>

                        <CardDescription>
                            {user.email}
                        </CardDescription>
                    </div>

                    <Badge
                        variant={
                            user.status === "ACTIVE"
                                ? "success"
                                : "destructive"
                        }
                    >
                        {user.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-line bg-canvas p-4">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                            User ID
                        </dt>

                        <dd className="mt-2 text-sm font-medium text-text-primary">
                            {user.id}
                        </dd>
                    </div>

                    <div className="rounded-xl border border-line bg-canvas p-4">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                            Role
                        </dt>

                        <dd className="mt-2 flex items-center gap-2 text-sm font-medium text-text-primary">
                            <ShieldCheck
                                className="size-4 text-brand-700"
                                aria-hidden="true"
                            />
                            {user.role}
                        </dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    );
}