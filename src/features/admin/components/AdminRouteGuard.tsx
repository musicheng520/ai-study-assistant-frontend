import {
    LockKeyhole,
    ShieldAlert,
} from "lucide-react";
import type {
    ReactNode,
} from "react";
import { Link } from "react-router";

import {
    Badge,
    Card,
    buttonVariants,
} from "@/components/ui";
import { useAuth } from "@/features/auth/context";
import { isAdminUser } from "@/features/auth/model";

type AdminRouteGuardProps = {
    children: ReactNode;
};

export function AdminRouteGuard({
                                    children,
                                }: AdminRouteGuardProps) {
    const { user } = useAuth();

    if (isAdminUser(user)) {
        return children;
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-3xl">
                <Card className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                            <ShieldAlert
                                className="size-6"
                                aria-hidden="true"
                            />
                        </div>

                        <Badge variant="warning">
                            Admin only
                        </Badge>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-start gap-3">
                            <div
                                className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-text-muted"
                                aria-hidden="true"
                            >
                                <LockKeyhole className="size-5" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-xl font-semibold text-text-primary">
                                    Admin access required
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                                    This observability area is only
                                    available to ADMIN users. Regular
                                    users can continue learning from
                                    Courses and Progress.
                                </p>

                                <div className="mt-5 flex flex-wrap gap-3">
                                    <Link
                                        to="/"
                                        className={buttonVariants({
                                            variant: "secondary",
                                        })}
                                    >
                                        Back to workspace
                                    </Link>

                                    <Link
                                        to="/courses"
                                        className={buttonVariants({
                                            variant: "primary",
                                        })}
                                    >
                                        Go to courses
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
        </main>
    );
}