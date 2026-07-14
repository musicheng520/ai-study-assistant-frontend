import {
    Plus,
    Sparkles,
} from "lucide-react";

import { PageHeader } from "@/components/layout";
import {
    Badge,
    Button,
} from "@/components/ui";
import { DesignSystemPreview } from "@/features/home/components/DesignSystemPreview";
import { BackendStatus } from "@/features/system/components/BackendStatus";

export function HomePage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl">
                <PageHeader
                    eyebrow={
                        <Badge variant="ai">
                            <Sparkles
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            AI learning workspace
                        </Badge>
                    }
                    title="Continue learning"
                    description="Build course workspaces from your documents, ask cited questions and turn course content into practical study materials."
                    actions={
                        <Button disabled>
                            <Plus
                                className="size-4"
                                aria-hidden="true"
                            />
                            Create course
                        </Button>
                    }
                />

                <div className="mt-8">
                    <BackendStatus />
                </div>

                <DesignSystemPreview />
            </section>
        </main>
    );
}