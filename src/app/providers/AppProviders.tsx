import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { queryClient } from "@/app/query-client/queryClient";
import { AuthProvider } from "@/features/auth/context";

type AppProvidersProps = {
    children: ReactNode;
};

export function AppProviders({
                                 children,
                             }: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    );
}