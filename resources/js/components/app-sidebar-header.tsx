import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { NavUser } from '@/components/nav-user';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Moon, Sun } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { isDark, toggle } = useDarkMode();
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {/* <SidebarFooter> */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggle}
                    title={
                        isDark ? 'Switch to light mode' : 'Switch to dark mode'
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-sidebar-foreground/60 transition hover:bg-sidebar-accent hover:text-orange-500"
                >
                    {isDark ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </button>

                <NavUser />
            </div>
            {/* </SidebarFooter> */}
        </header>
    );
}
