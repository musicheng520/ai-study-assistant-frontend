import {
    BookOpenCheck,
    GraduationCap,
    MessageSquareText,
    Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

type AuthPageLayoutProps = {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
    footer: ReactNode;
};

const featureItems = [
    {
        title: "Course-based workspace",
        description:
            "Organise PDFs, DOCX files and learning resources by course.",
        icon: BookOpenCheck,
    },
    {
        title: "Cited AI answers",
        description:
            "Ask questions and keep the original course sources visible.",
        icon: MessageSquareText,
    },
    {
        title: "Practical study tools",
        description:
            "Generate summaries, quizzes and revision materials.",
        icon: Sparkles,
    },
];

export function AuthPageLayout({
                                   eyebrow,
                                   title,
                                   description,
                                   children,
                                   footer,
                               }: AuthPageLayoutProps) {
    return (
        <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
            <section className="relative hidden overflow-hidden bg-brand-900 px-10 py-12 text-white lg:flex lg:flex-col">
                <div
                    className="pointer-events-none absolute -left-24 top-32 size-72 rounded-full bg-brand-700/40 blur-3xl"
                    aria-hidden="true"
                />

                <div
                    className="pointer-events-none absolute -right-20 bottom-16 size-80 rounded-full bg-ai-600/30 blur-3xl"
                    aria-hidden="true"
                />

                <Link
                    className="relative flex w-fit items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    to="/"
                    aria-label="AI Study Assistant home"
                >
          <span
              className="grid size-11 place-items-center rounded-xl bg-white text-brand-900"
              aria-hidden="true"
          >
            <GraduationCap className="size-6" />
          </span>

                    <span>
            <span className="block font-semibold">
              AI Study Assistant
            </span>

            <span className="mt-0.5 block text-sm text-brand-100">
              Course-based learning workspace
            </span>
          </span>
                </Link>

                <div className="relative my-auto max-w-xl py-14">
                    <p className="text-sm font-medium text-brand-200">
                        Learn from your own course materials
                    </p>

                    <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">
                        Turn documents into a focused learning workflow.
                    </h2>

                    <p className="mt-5 max-w-lg text-base leading-7 text-brand-100">
                        Upload course materials, ask grounded questions
                        and generate practical revision resources in one
                        structured workspace.
                    </p>

                    <div className="mt-10 space-y-5">
                        {featureItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-4"
                                >
                  <span
                      className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white"
                      aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>

                                    <div>
                                        <p className="font-medium">
                                            {item.title}
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-brand-100">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <p className="relative text-sm text-brand-200">
                    Built with React, TypeScript and Spring Boot.
                </p>
            </section>

            <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
                <div className="w-full max-w-md">
                    <Link
                        className="mb-9 flex w-fit items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 lg:hidden"
                        to="/"
                        aria-label="AI Study Assistant home"
                    >
            <span
                className="grid size-10 place-items-center rounded-xl bg-brand-800 text-white"
                aria-hidden="true"
            >
              <GraduationCap className="size-5" />
            </span>

                        <span>
              <span className="block text-sm font-semibold text-text-primary">
                AI Study Assistant
              </span>

              <span className="block text-xs text-text-muted">
                Learning workspace
              </span>
            </span>
                    </Link>

                    <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
                        <p className="text-sm font-medium text-brand-700">
                            {eyebrow}
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                            {title}
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-text-secondary">
                            {description}
                        </p>

                        <div className="mt-7">
                            {children}
                        </div>

                        <div className="mt-7 border-t border-line pt-6 text-center text-sm text-text-secondary">
                            {footer}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}