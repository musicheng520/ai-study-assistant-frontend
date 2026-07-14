import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    CircleAlert,
    LockKeyhole,
    Mail,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router";

import { ErrorState } from "@/components/feedback";
import {
    Button,
    Input,
} from "@/components/ui";
import { useLoginMutation } from "@/features/auth/api";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { useAuth } from "@/features/auth/context";
import {
    loginRequestSchema,
    type LoginRequest,
} from "@/features/auth/model";
import { parseAuthRedirectState } from "@/features/auth/routing/authRedirect";
import {
    type ApiError,
    toApiError,
} from "@/lib/errors/ApiError";

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        returnTo,
        reason,
    } = parseAuthRedirectState(
        location.state,
    );

    const {
        status,
        establishSession,
        clearSessionNotice,
    } = useAuth();

    const loginMutation =
        useLoginMutation();

    const [
        rememberSession,
        setRememberSession,
    ] = useState(false);

    const [
        submissionError,
        setSubmissionError,
    ] = useState<ApiError | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginRequest>({
        resolver: zodResolver(
            loginRequestSchema,
        ),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    /*
     * 用户已经登录时，如果手动进入 /login，
     * 自动跳转到 returnTo。
     *
     * 没有 returnTo 时，parseAuthRedirectState
     * 会默认返回 "/"。
     */
    useEffect(() => {
        if (status !== "authenticated") {
            return;
        }

        navigate(returnTo, {
            replace: true,
        });
    }, [
        navigate,
        returnTo,
        status,
    ]);

    /*
     * Session expired 的原因已经保存在
     * 当前 Login 路由的 location.state 中。
     *
     * 因此进入 Login 页面后，可以清理
     * AuthProvider 中的临时 sessionNotice。
     */
    useEffect(() => {
        if (reason !== "session-expired") {
            return;
        }

        clearSessionNotice();
    }, [
        clearSessionNotice,
        reason,
    ]);

    async function onSubmit(
        formValues: LoginRequest,
    ): Promise<void> {
        setSubmissionError(null);
        loginMutation.reset();

        try {
            /*
             * 第一步：
             * POST /api/auth/login
             */
            const authResponse =
                await loginMutation.mutateAsync(
                    formValues,
                );

            /*
             * 第二步：
             * 保存 JWT，并请求 GET /api/auth/me
             * 建立真实用户会话。
             */
            await establishSession(
                authResponse,
                rememberSession,
            );

            clearSessionNotice();

            /*
             * 第三步：
             * 回到用户原本想访问的页面。
             */
            navigate(returnTo, {
                replace: true,
            });
        } catch (error) {
            const apiError =
                toApiError(error);

            const fieldErrors =
                apiError.fieldErrors;

            let fieldErrorApplied = false;

            /*
             * 后端如果返回字段级错误，
             * 将错误放到对应输入框下。
             */
            if (fieldErrors?.email) {
                setError("email", {
                    type: "server",
                    message: fieldErrors.email,
                });

                fieldErrorApplied = true;
            }

            if (fieldErrors?.password) {
                setError("password", {
                    type: "server",
                    message: fieldErrors.password,
                });

                fieldErrorApplied = true;
            }

            /*
             * 如果不是字段级错误，
             * 显示表单顶部通用错误。
             */
            if (!fieldErrorApplied) {
                setSubmissionError(apiError);
            }
        }
    }

    const formIsBusy =
        isSubmitting ||
        loginMutation.isPending ||
        status === "checking";

    return (
        <AuthPageLayout
            eyebrow="Welcome back"
            title="Sign in to your workspace"
            description="Continue learning from your course documents and saved study resources."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link
                        className="font-medium text-brand-700 underline-offset-4 hover:underline"
                        state={location.state}
                        to="/register"
                    >
                        Create one
                    </Link>
                </>
            }
        >
            <form
                noValidate
                className="space-y-5"
                onSubmit={handleSubmit(
                    onSubmit,
                )}
            >
                {reason === "session-expired" ? (
                    <div
                        className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
                        role="status"
                    >
                        <CircleAlert
                            className="mt-0.5 size-5 shrink-0 text-amber-700"
                            aria-hidden="true"
                        />

                        <div>
                            <p className="text-sm font-medium text-amber-900">
                                Session expired
                            </p>

                            <p className="mt-1 text-sm leading-6 text-amber-800">
                                Your previous session is no longer
                                valid. Sign in again to continue.
                            </p>
                        </div>
                    </div>
                ) : null}

                {submissionError ? (
                    <ErrorState
                        compact
                        title="Sign in failed"
                        message={
                            submissionError.message
                        }
                    />
                ) : null}

                <div>
                    <label
                        className="text-sm font-medium text-text-primary"
                        htmlFor="login-email"
                    >
                        Email address
                    </label>

                    <div className="relative mt-2">
                        <Mail
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                            aria-hidden="true"
                        />

                        <Input
                            id="login-email"
                            className="pl-10"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            aria-describedby={
                                errors.email
                                    ? "login-email-error"
                                    : undefined
                            }
                            aria-invalid={
                                errors.email
                                    ? "true"
                                    : "false"
                            }
                            disabled={formIsBusy}
                            {...register("email")}
                        />
                    </div>

                    {errors.email ? (
                        <p
                            id="login-email-error"
                            className="mt-2 text-sm text-red-700"
                            role="alert"
                        >
                            {errors.email.message}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label
                        className="text-sm font-medium text-text-primary"
                        htmlFor="login-password"
                    >
                        Password
                    </label>

                    <div className="relative mt-2">
                        <LockKeyhole
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                            aria-hidden="true"
                        />

                        <Input
                            id="login-password"
                            className="pl-10"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            aria-describedby={
                                errors.password
                                    ? "login-password-error"
                                    : undefined
                            }
                            aria-invalid={
                                errors.password
                                    ? "true"
                                    : "false"
                            }
                            disabled={formIsBusy}
                            {...register("password")}
                        />
                    </div>

                    {errors.password ? (
                        <p
                            id="login-password-error"
                            className="mt-2 text-sm text-red-700"
                            role="alert"
                        >
                            {errors.password.message}
                        </p>
                    ) : null}
                </div>

                <label className="flex cursor-pointer items-start gap-3">
                    <input
                        className="mt-0.5 size-4 rounded border-line accent-brand-700"
                        type="checkbox"
                        checked={rememberSession}
                        disabled={formIsBusy}
                        onChange={(event) => {
                            setRememberSession(
                                event.target.checked,
                            );
                        }}
                    />

                    <span>
            <span className="block text-sm font-medium text-text-primary">
              Keep me signed in
            </span>

            <span className="mt-0.5 block text-xs leading-5 text-text-muted">
              Store the session on this
              device after the browser is
              closed.
            </span>
          </span>
                </label>

                <Button
                    className="w-full"
                    disabled={formIsBusy}
                    size="lg"
                    type="submit"
                >
                    {formIsBusy
                        ? "Signing in..."
                        : "Sign in"}

                    {!formIsBusy ? (
                        <ArrowRight
                            className="size-4"
                            aria-hidden="true"
                        />
                    ) : null}
                </Button>
            </form>
        </AuthPageLayout>
    );
}