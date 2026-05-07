import { Link, usePage } from '@inertiajs/react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Bot,
    CalendarCheck,
    Calculator,
    CreditCard,
    FileText,
    Headphones,
    History,
    LayoutGrid,
    Send,
    Settings,
    Sun,
    Target,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';

import {
    dashboard,
    deposit,
    transactions,
    transfer,
    withdraw,
    bills,
} from '@/routes';

// ─── Nav Groups ───────────────────────────────────────────────────
const bankingNav = [
    { title: 'Dashboard', href: dashboard.definition.url, icon: LayoutGrid },
    { title: 'Deposit', href: deposit.definition.url, icon: ArrowDownToLine },
    { title: 'Withdraw', href: withdraw.definition.url, icon: ArrowUpFromLine },
    { title: 'Transactions', href: transactions.definition.url, icon: History },
    { title: 'Transfer', href: transfer.definition.url, icon: Send },
    { title: 'Pay Bills', href: bills.definition.url, icon: FileText },
    { title: 'My Card', href: '/account', icon: CreditCard },
];

const planningNav = [
    { title: 'Savings Center', href: '/savings/index', icon: Target },
    { title: 'Simulation', href: '/simulation', icon: Calculator },
    { title: 'Appointment', href: '/appointments/create', icon: CalendarCheck },
];

const supportNav = [
    { title: 'AI Advisor', href: '/ai-chat', icon: Bot },
    { title: 'Support', href: '/support', icon: Headphones },
];

// ─── Bank Logo (reusable inline SVG) ─────────────────────────────
function BankLogo({
    
    className = '',
}: {
    size?: number;
    className?: string;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 84"
            className={className}
            fill="none"
        >
            <path
                d="M11 78 V30 C11 26.5 12.3 23.7 14.8 21.5 L19.4 17.4 L22.8 13.2 L26.1 9.1 L29.1 5.8 L32 3.5 L34.9 5.8 L37.9 9.1 L41.2 13.2 L44.6 17.4 L49.2 21.5 C51.7 23.7 53 26.5 53 30 V78"
                stroke="#F97316"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17 29 C17 26.4 18 24.2 19.9 22.5 L24 18.8 L26.8 15.2 L29.2 12.1 L32 9.8 L34.8 12.1 L37.2 15.2 L40 18.8 L44.1 22.5 C46 24.2 47 26.4 47 29"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18 78 V33 C18 30.6 18.9 28.6 20.6 27 L24.4 23.4 L27 20.2 L29.2 17.6 L32 15.4 L34.8 17.6 L37 20.2 L39.6 23.4 L43.4 27 C45.1 28.6 46 30.6 46 33 V78"
                stroke="#F97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18 34.5H21.2"
                stroke="#F97316"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d="M42.8 34.5H46"
                stroke="#F97316"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d="M32 20.2 L33.1 22.6 L35.7 21.9 L35 24.5 L37.4 25.6 L35 26.7 L35.7 29.3 L33.1 28.6 L32 31 L30.9 28.6 L28.3 29.3 L29 26.7 L26.6 25.6 L29 24.5 L28.3 21.9 L30.9 22.6 Z"
                fill="#F97316"
            />
            <g transform="translate(32 53)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
                    <path
                        key={r}
                        d="M0 0 C2 -2.2 4.2 -5.2 4.2 -8.4 C4.2 -10.8 2.5 -12.6 0 -13.4 C-2.5 -12.6 -4.2 -10.8 -4.2 -8.4 C-4.2 -5.2 -2 -2.2 0 0Z"
                        stroke="#F97316"
                        strokeWidth="1.6"
                        fill="none"
                        transform={`rotate(${r})`}
                    />
                ))}
                <circle
                    cx="0"
                    cy="0"
                    r="2.2"
                    stroke="#F97316"
                    strokeWidth="1.4"
                    fill="none"
                />
            </g>
        </svg>
    );
}

// ─── Component ────────────────────────────────────────────────────
export function AppSidebar() {
    const page = usePage();
    const { auth } = page.props as any;

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* ── Header / Logo ── */}
            <SidebarHeader className="border-b border-sidebar-border/60 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="h-16! py-2! group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:!h-9 group-data-[collapsible=icon]:!w-9 group-data-[collapsible=icon]:justify-center data-[active=true]:bg-orange-600 data-[active=true]:text-white [&>svg]:!h-9 [&>svg]:!w-9"
                            asChild
                        >
                            <Link href={dashboard.definition.url} prefetch>
                                <BankLogo className="shrink-0" />

                                <div className="leading-tight group-data-[collapsible=icon]:hidden">
                                    <p className="text-[13px] font-extrabold tracking-wide text-sidebar-foreground">
                                        BANK AL-ANDALOUS
                                    </p>
                                    <p className="text-[11px] font-medium text-sidebar-foreground/50">
                                        بنك الأندلس
                                    </p>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ── Nav Content ── */}
            <SidebarContent className="gap-0 py-3">
                <NavMain items={bankingNav} groupLabel="Banking" />
                <SidebarSeparator className="mx-4 my-2 opacity-50" />
                <NavMain items={planningNav} groupLabel="Planning" />
                <SidebarSeparator className="mx-4 my-2 opacity-50" />
                <NavMain items={supportNav} groupLabel="Support" />
            </SidebarContent>

            {/* ── Footer ── */}
        </Sidebar>
    );
}
