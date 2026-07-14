import { createBrowserRouter } from "react-router";

import { RouteErrorBoundary } from "@/app/error-boundary/RouteErrorBoundary";
import { AppLayout } from "@/app/router/layouts/AppLayout";
import { RootLayout } from "@/app/router/layouts/RootLayout";
import { NotFoundPage } from "@/app/router/pages/NotFoundPage";
import { appRouteHandle } from "@/app/router/routeHandle";
import { AccountPage } from "@/features/account/pages/AccountPage";
import { AuthPlaceholderPage } from "@/features/auth/pages/AuthPlaceholderPage";
import { CoursesPage } from "@/features/courses/pages/CoursesPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { OverallProgressPage } from "@/features/progress/pages/OverallProgressPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                        handle: appRouteHandle("Home"),
                    },
                    {
                        path: "courses",
                        element: <CoursesPage />,
                        handle: appRouteHandle("Courses"),
                    },
                    {
                        path: "progress",
                        element: <OverallProgressPage />,
                        handle: appRouteHandle("Overall progress"),
                    },
                    {
                        path: "account",
                        element: <AccountPage />,
                        handle: appRouteHandle("Account"),
                    },
                ],
            },
            {
                path: "login",
                element: <AuthPlaceholderPage mode="login" />,
            },
            {
                path: "register",
                element: <AuthPlaceholderPage mode="register" />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);