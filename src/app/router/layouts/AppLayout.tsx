import { Outlet } from "react-router";

import {
    AppHeader,
    DesktopSidebar,
    MobileBottomNavigation,
    SkipLink,
} from "@/components/layout";

export function AppLayout() {
    return (
        <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
            <SkipLink />

            <DesktopSidebar />

            <div className="min-w-0 pb-24 lg:pb-0">
                <AppHeader />

                <div
                    id="main-content"
                    tabIndex={-1}
                >
                    <Outlet />
                </div>
            </div>

            <MobileBottomNavigation />
        </div>
    );
}