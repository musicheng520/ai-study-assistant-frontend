import { useQuery } from "@tanstack/react-query";

import { getHealth } from "@/features/system/api/system.api";

export const systemQueryKeys = {
    health: ["system", "health"] as const,
};

export function useHealthQuery() {
    return useQuery({
        queryKey: systemQueryKeys.health,
        queryFn: ({ signal }) => getHealth(signal),
        staleTime: 60_000,
        retry: false,
    });
}