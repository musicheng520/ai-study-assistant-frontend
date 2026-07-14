import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    LockKeyhole,
    Mail,
    UserRound,
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
import { useRegisterMutation } from "@/features/auth/api";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { useAuth } from "@/features/auth/context";
import {
    registerRequestSchema,
    type RegisterFormValues,
    type RegisterRequest,
} from "@/features/auth/model";
import { parseAuthRedirectState } from "@/features/auth/routing/authRedirect";
import {
    type ApiError,
    toApiError,
} from "@/lib/errors/ApiError";

export function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        returnTo,
    } = parseAuthRedirectState(
        location.state,
    );

    const {
        status,
        establishSession,
        clearSessionNotice,
    } = useAuth();

    const registerMutation =
        useRegisterMutation();

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
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(
            registerRequestSchema,
        ),
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    /*
     * 已登录用户手动访问 /register 时，
     * 自动前往 returnTo。
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

    async function onSubmit(
        formValues: RegisterFormValues,
    ): Promise<void> {
        setSubmissionError(null);
        registerMutation.reset();

        /*
         * confirmPassword 只属于前端表单，
         * 后端注册接口不接收该字段。
         */
        const request: RegisterRequest = {
            displayName:
            formValues.displayName,
            email: formValues.email,
            password: formValues.password,
        };

        try {
            /*
             * 第一步：
             * POST /api/auth/register
             */
            const authResponse =
                await registerMutation.mutateAsync(
                    request,
                );

            /*
             * 第二步：
             * 保存 JWT 并请求 /api/auth/me。
             */
            await establishSession(
                authResponse,
                rememberSession,
            );

            clearSessionNotice();

            /*
             * 第三步：
             * 返回注册前准备访问的页面。
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

            if (fieldErrors?.displayName) {
                setError("displayName", {
                    type: "server",
                    message:
                    fieldErrors.displayName,
                });

                fieldErrorApplied = true;
            }

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

            if (!fieldErrorApplied) {
                setSubmissionError(apiError);
            }
        }
    }

    const formIsBusy =
        isSubmitting ||
        registerMutation.isPending ||
        status === "checking";

    return (
        <AuthPageLayout
            eyebrow="Create your account"
            title="Start building your learning workspace"
            description="Register to organise course documents and create grounded AI study resources."
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        className="font-medium text-brand-700 underline-offset-4 hover:underline"
                        state={location.state}
                        to="/login"
                    >
                        Sign in
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
                {submissionError ? (
                    <ErrorState
                        compact
                        title="Registration failed"
                        message={
                            submissionError.message
                        }
                    />
                ) : null}

                <div>
                    <label
                        className="text-sm font-medium text-text-primary"
                        htmlFor="register-display-name"
                    >
                        Display name
                    </label>

                    <div className="relative mt-2">
                        <UserRound
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                            aria-hidden="true"
                        />

                        <Input
                            id="register-display-name"
                            className="pl-10"
                            autoComplete="name"
                            placeholder="Your name"
                            aria-describedby={
                                errors.displayName
                                    ? "register-display-name-error"
                                    : undefined
                            }
                            aria-invalid={
                                errors.displayName
                                    ? "true"
                                    : "false"
                            }
                            disabled={formIsBusy}
                            {...register(
                                "displayName",
                            )}
                        />
                    </div>

                    {errors.displayName ? (
                        <p
                            id="register-display-name-error"
                            className="mt-2 text-sm text-red-700"
                            role="alert"
                        >
                            {
                                errors.displayName
                                    .message
                            }
                        </p>
                    ) : null}
                </div>

                <div>
                    <label
                        className="text-sm font-medium text-text-primary"
                        htmlFor="register-email"
                    >
                        Email address
                    </label>

                    <div className="relative mt-2">
                        <Mail
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                            aria-hidden="true"
                        />

                        <Input
                            id="register-email"
                            className="pl-10"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            aria-describedby={
                                errors.email
                                    ? "register-email-error"
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
                            id="register-email-error"
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
                        htmlFor="register-password"
                    >
                        Password
                    </label>

                    <div className="relative mt-2">
                        <LockKeyhole
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                            aria-hidden="true"
                        />

                        <Input
                            id="register-password"
                            className="pl-10"
                            type="password"
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            aria-describedby={
                                errors.password
                                    ? "register-password-error"
                                    : "register-password-help"
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
                            id="register-password-error"
                            className="mt-2 text-sm text-red-700"
                            role="alert"
                        >
                            {errors.password.message}
                        </p>
                    ) : (
                        <p
                            id="register-password-help"
                            className="mt-2 text-xs leading-5 text-text-muted"
                        >
                            Use at least 8 characters.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        className="text-sm font-medium text-text-primary"
                        htmlFor="register-confirm-password"
                    >
                        Confirm password
                    </label>

                    <div className="relative mt-2">
                        <LockKeyhole
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                            aria-hidden="true"
                        />

                        <Input
                            id="register-confirm-password"
                            className="pl-10"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Repeat your password"
                            aria-describedby={
                                errors.confirmPassword
                                    ? "register-confirm-password-error"
                                    : undefined
                            }
                            aria-invalid={
                                errors.confirmPassword
                                    ? "true"
                                    : "false"
                            }
                            disabled={formIsBusy}
                            {...register(
                                "confirmPassword",
                            )}
                        />
                    </div>

                    {errors.confirmPassword ? (
                        <p
                            id="register-confirm-password-error"
                            className="mt-2 text-sm text-red-700"
                            role="alert"
                        >
                            {
                                errors.confirmPassword
                                    .message
                            }
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
              Preserve this session after
              the browser is closed.
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
                        ? "Creating account..."
                        : "Create account"}

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