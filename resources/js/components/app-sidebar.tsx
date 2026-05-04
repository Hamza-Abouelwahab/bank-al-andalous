import { Link } from '@inertiajs/react';
import {  ArrowDownToLine, ArrowUpFromLine, Bot, CreditCard, FileText, Headphones, History, LayoutGrid, Send, Target } from 'lucide-react';  //BookOpen, FolderGit2,
import AppLogo from '@/components/app-logo';
// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
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
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Deposit',
        href: deposit(),
        icon: ArrowDownToLine,
    },
    {
        title: 'Withdraw',
        href: withdraw(),
        icon: ArrowUpFromLine,
    },
    {
        title: 'Transaction History',
        href: transactions(),
        icon: History,
    },
    {
        title: 'Transfer',
        href: transfer(),
        icon: Send,
    },
    {
        title: 'Pay Bills',
        href: bills(),
        icon: FileText,
    },
    {
        title: 'My Card',
        href: '/account',
        icon: CreditCard,
    },
    {
        title: 'Create Saving Chalenges ',
        href: '/saving-challenges/create',
        icon: Target,
    },
    {
        title: 'Ai Advisor ',
        href: 'ai-chat',
        icon: Bot,
    },
    {
        title: 'Support',
        href: '#',
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
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent >
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
