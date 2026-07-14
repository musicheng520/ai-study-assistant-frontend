import {
    queryOptions,
    useQuery,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";
import { getCurrentUser } from "@/features/auth/api/auth.api";

export function currentUserQueryOptions() {
    return queryOptions({
        queryKey: queryKeys.auth.me(),

        queryFn: ({ signal }) =>
            getCurrentUser(signal),

        staleTime: 5 * 60_000,

        retry: false,
    });
}

export function useCurrentUserQuery(
    enabled: boolean,
) {
    return useQuery({
        ...currentUserQueryOptions(),
        enabled,
    });
}