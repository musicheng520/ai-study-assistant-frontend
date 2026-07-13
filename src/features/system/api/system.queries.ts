import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";
import { getHealth } from "@/features/system/api/system.api";

export function useHealthQuery() {
    return useQuery({
        queryKey: queryKeys.system.health(),
        queryFn: ({ signal }) => getHealth(signal),
        staleTime: 60_000,
        retry: false,
    });
}