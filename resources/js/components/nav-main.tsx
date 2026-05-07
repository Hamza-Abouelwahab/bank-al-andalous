import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

interface NavMainProps {
    items: NavItem[];
    groupLabel?: string;
}

export function NavMain({ items = [], groupLabel }: NavMainProps) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0 group-data-[collapsible=icon]:px-0">
            {groupLabel && (
                <SidebarGroupLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40">
                    {groupLabel}
                </SidebarGroupLabel>
            )}

            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`
                                    group h-10 rounded-xl px-3 font-medium transition-all duration-150
                                    hover:bg-orange-50 hover:text-orange-600
                                    dark:hover:bg-orange-500/10 dark:hover:text-orange-400

                                    group-data-[collapsible=icon]:!h-10
                                    group-data-[collapsible=icon]:!w-10
                                    group-data-[collapsible=icon]:!p-0
                                    group-data-[collapsible=icon]:!justify-center
                                    group-data-[collapsible=icon]:!bg-transparent
                                    group-data-[collapsible=icon]:hover:!bg-transparent

                                    ${
                                        active
                                            ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-500/10 dark:bg-orange-500/10 dark:text-orange-400'
                                            : 'text-sidebar-foreground/70'
                                    }
                                `}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="
                                        flex w-full items-center gap-3
                                        group-data-[collapsible=icon]:justify-center
                                        group-data-[collapsible=icon]:gap-0
                                    "
                                >
                                    {item.icon && (
                                        <span
                                            className={`
                                                flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-150

                                                ${
                                                    active
                                                        ? 'text-orange-600 group-data-[collapsible=icon]:bg-orange-600 group-data-[collapsible=icon]:text-white group-data-[collapsible=icon]:shadow-md group-data-[collapsible=icon]:shadow-orange-500/30'
                                                        : 'text-sidebar-foreground/50 group-hover:text-orange-600 dark:group-hover:text-orange-400'
                                                }
                                            `}
                                        >
                                            <item.icon className="h-4 w-4" />
                                        </span>
                                    )}

                                    <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
                                        {item.title}
                                    </span>

                                    {active && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-500 group-data-[collapsible=icon]:hidden" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}