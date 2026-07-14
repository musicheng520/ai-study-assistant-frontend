import {
    ShieldCheck,
    UserRound,
} from "lucide-react";

import {
    PageHeader,
} from "@/components/layout";
import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui";

export function AccountPage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl">
                <PageHeader
                    eyebrow={
                        <Badge variant="info">
                            <UserRound
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Account
                        </Badge>
                    }
                    title="Account settings"
                    description="Review your profile and session information."
                />

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Profile
                            </CardTitle>

                            <CardDescription>
                                User information will come from
                                GET /api/auth/me.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-xl border border-line bg-canvas p-4">
                                <p className="text-sm font-medium text-text-primary">
                                    Authentication integration pending
                                </p>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    Display name, email, role and account status
                                    will be connected in M58.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Security
                            </CardTitle>

                            <CardDescription>
                                Session and route protection status.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-start gap-3 rounded-xl border border-ai-100 bg-ai-50 p-4">
                                <ShieldCheck
                                    className="mt-0.5 size-5 shrink-0 text-ai-700"
                                    aria-hidden="true"
                                />

                                <div>
                                    <p className="text-sm font-medium text-ai-700">
                                        Protected routes begin in M58
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                                        The frontend will validate the stored JWT
                                        through the backend current-user endpoint.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}