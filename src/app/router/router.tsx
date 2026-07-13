import { createBrowserRouter } from "react-router";

import { RouteErrorBoundary } from "@/app/error-boundary/RouteErrorBoundary";
import { RootLayout } from "@/app/router/layouts/RootLayout";
import { NotFoundPage } from "@/app/router/pages/NotFoundPage";
import { AuthPlaceholderPage } from "@/features/auth/pages/AuthPlaceholderPage";
import { HomePage } from "@/features/home/pages/HomePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                index: true,
                element: <HomePage />,
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