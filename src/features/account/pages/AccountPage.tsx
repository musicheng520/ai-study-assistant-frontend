import {
    LogOut,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import {
    useState,
} from "react";
import {
    useNavigate,
} from "react-router";

import { PageHeader } from "@/components/layout";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { AuthSessionCard } from "@/features/auth/components/AuthSessionCard";
import { useAuth } from "@/features/auth/context";
import { getUserRoleLabel } from "@/features/auth/model";

export function AccountPage() {
    const navigate = useNavigate();

    const {
        user,
        signOut,
    } = useAuth();

    const [
        isSigningOut,
        setIsSigningOut,
    ] = useState(false);

    async function handleSignOut(): Promise<void> {
        if (isSigningOut) {
            return;
        }

        setIsSigningOut(true);

        await signOut();

        navigate("/login", {
            replace: true,
        });
    }

    const roleLabel = user
        ? getUserRoleLabel(user.role)
        : null;

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
                    description="Review your profile, role and current browser session."
                />

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <AuthSessionCard />

                    <div className="space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Access role
                                </CardTitle>

                                <CardDescription>
                                    Your role is provided by the backend
                                    and controls access to protected
                                    application capabilities.
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
                                            {roleLabel ??
                                                "Role unavailable"}
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-text-secondary">
                                            {user?.role === "ADMIN"
                                                ? "This account has administrator privileges. Admin navigation will only be added when the corresponding frontend module is implemented."
                                                : "This account has standard user access to courses, documents and learning tools."}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Current session
                                </CardTitle>

                                <CardDescription>
                                    Sign out to remove the JWT and cached
                                    user data from this browser.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Button
                                    disabled={isSigningOut}
                                    variant="secondary"
                                    onClick={() => {
                                        void handleSignOut();
                                    }}
                                >
                                    <LogOut
                                        className="size-4"
                                        aria-hidden="true"
                                    />

                                    {isSigningOut
                                        ? "Signing out..."
                                        : "Sign out"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    );
}