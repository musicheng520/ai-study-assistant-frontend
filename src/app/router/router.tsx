import { createBrowserRouter } from "react-router";

import { RouteErrorBoundary } from "@/app/error-boundary/RouteErrorBoundary";
import { AppLayout } from "@/app/router/layouts/AppLayout";
import { RootLayout } from "@/app/router/layouts/RootLayout";
import { NotFoundPage } from "@/app/router/pages/NotFoundPage";
import { appRouteHandle } from "@/app/router/routeHandle";
import { AccountPage } from "@/features/account/pages/AccountPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/features/auth/routing/ProtectedRoute";
import { CourseLayout } from "@/features/courses/layouts/CourseLayout";
import { CourseOverviewPage } from "@/features/courses/pages/CourseOverviewPage";
import { CoursesPage } from "@/features/courses/pages/CoursesPage";
import { DocumentsPage } from "@/features/documents/pages/DocumentsPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { OverallProgressPage } from "@/features/progress/pages/OverallProgressPage";
import { ChatPage } from "@/features/chat";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <AppLayout />,
                        children: [
                            {
                                index: true,
                                element: <HomePage />,
                                handle:
                                    appRouteHandle("Home"),
                            },
                            {
                                path: "courses",
                                element: <CoursesPage />,
                                handle:
                                    appRouteHandle("Courses"),
                            },
                            {
                                path: "courses/:courseId",
                                element: <CourseLayout />,
                                handle:
                                    appRouteHandle(
                                        "Course workspace",
                                    ),
                                children: [
                                    {
                                        index: true,
                                        element:
                                            <CourseOverviewPage />,
                                        handle:
                                            appRouteHandle(
                                                "Course overview",
                                            ),
                                    },
                                    {
                                        path: "documents",
                                        element:
                                            <DocumentsPage />,
                                        handle:
                                            appRouteHandle(
                                                "Documents",
                                            ),
                                    },
                                    {
                                        path: "chat",
                                        element:
                                            <ChatPage />,
                                        handle:
                                            appRouteHandle(
                                                "AI Chat",
                                            ),
                                    },
                                    {
                                        path: "chat/:sessionId",
                                        element:
                                            <ChatPage />,
                                        handle:
                                            appRouteHandle(
                                                "AI Chat",
                                            ),
                                    },
                                ],
                            },
                            {
                                path: "progress",
                                element:
                                    <OverallProgressPage />,
                                handle:
                                    appRouteHandle(
                                        "Overall progress",
                                    ),
                            },
                            {
                                path: "account",
                                element: <AccountPage />,
                                handle:
                                    appRouteHandle(
                                        "Account",
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);