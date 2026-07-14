import {
    CircleAlert,
    LoaderCircle,
    LogOut,
    RotateCw,
    ShieldOff,
} from "lucide-react";

import {
    Button,
    Card,
    CardContent,
} from "@/components/ui";

type SessionStateScreenProps =
    | {
    variant: "checking";
}
    | {
    variant: "error";
    message: string;
    onRetry: () => void;
}
    | {
    variant: "disabled";
    message: string;
    onSignOut: () => void;
};

export function SessionStateScreen(
    props: SessionStateScreenProps,
) {
    if (props.variant === "checking") {
        return (
            <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
                <Card className="w-full max-w-md">
                    <CardContent className="py-10 text-center">
                        <LoaderCircle
                            className="mx-auto size-7 animate-spin text-brand-700"
                            aria-hidden="true"
                        />

                        <h1 className="mt-5 text-lg font-semibold text-text-primary">
                            Checking your session
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            Validating your account with the
                            backend.
                        </p>
                    </CardContent>
                </Card>
            </main>
        );
    }

    if (props.variant === "error") {
        return (
            <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
                <Card className="w-full max-w-md">
                    <CardContent className="py-10 text-center">
                        <div
                            className="mx-auto grid size-12 place-items-center rounded-xl bg-red-50 text-red-700"
                            aria-hidden="true"
                        >
                            <CircleAlert className="size-6" />
                        </div>

                        <h1 className="mt-5 text-lg font-semibold text-text-primary">
                            Session validation failed
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            {props.message}
                        </p>

                        <Button
                            className="mt-6"
                            onClick={props.onRetry}
                        >
                            <RotateCw
                                className="size-4"
                                aria-hidden="true"
                            />
                            Try again
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
            <Card className="w-full max-w-md">
                <CardContent className="py-10 text-center">
                    <div
                        className="mx-auto grid size-12 place-items-center rounded-xl bg-red-50 text-red-700"
                        aria-hidden="true"
                    >
                        <ShieldOff className="size-6" />
                    </div>

                    <h1 className="mt-5 text-lg font-semibold text-text-primary">
                        Account disabled
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {props.message}
                    </p>

                    <Button
                        className="mt-6"
                        variant="secondary"
                        onClick={props.onSignOut}
                    >
                        <LogOut
                            className="size-4"
                            aria-hidden="true"
                        />
                        Use another account
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}