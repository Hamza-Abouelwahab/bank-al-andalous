import { Link } from '@inertiajs/react';
import { ArrowDownToLine, ArrowUpFromLine, Bot, CalendarCheck, CreditCard, FileText, Headphones, History, LayoutGrid, Send, Target } from 'lucide-react';  //BookOpen, FolderGit2,
import AppLogo from '@/components/app-logo';
// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { bills, dashboard, deposit, transactions, transfer, withdraw } from '@/routes';
import type { NavItem } from '@/types';
// import account from '@/routes/account';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.definition.url,
        icon: LayoutGrid,
    },
    {
        title: 'Deposit',
        href: deposit.definition.url,
        icon: ArrowDownToLine,
    },
    {
        title: 'Withdraw',
        href: withdraw.definition.url,
        icon: ArrowUpFromLine,
    },
    {
        title: 'Transaction History',
        href: transactions.definition.url,
        icon: History,
    },
    {
        title: 'Transfer',
        href: transfer.definition.url,
        icon: Send,
    },
    {
        title: 'Pay Bills',
        href: bills.definition.url,
        icon: FileText,
    },
    {
        title: 'My Card',
        href: '/account',
        icon: CreditCard,
    },
    {
        title: 'Create Saving Chalenges ',
        href: '/savings/index',
        icon: Target,
    },

    {
        title: 'Appointment ',
        href: '/appointments/create',
        icon: CalendarCheck,
    },

    {
        title: 'Simulation ',
        href: '/simulation',
        icon: CalendarCheck,
    },


    {
        title: 'Ai Advisor ',
        href: '/ai-chat',
        icon: Bot,
    },
    {
        title: 'Support',
        href: '/support',
        icon: Headphones,
    },

    
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard.definition.url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent >
                <NavMain items={mainNavItems} />
            </SidebarContent>


        </Sidebar>
    );
}
