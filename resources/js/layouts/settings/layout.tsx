import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="min-h-screen bg-[#f8f6f1] px-4 py-6 text-[#1f1a17] dark:bg-[#0F0D0B] dark:text-white">
            <div className="mx-auto max-w-6xl">
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                />

                <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
                    <aside className="w-full lg:w-56">
                        <nav
                            className="flex flex-col gap-2"
                            aria-label="Settings"
                        >
                            {sidebarNavItems.map((item, index) => {
                                const active = isCurrentOrParentUrl(item.href);

                                return (
                                    <Button
                                        key={`${toUrl(item.href)}-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn(
                                            'w-full justify-start rounded-xl px-4 py-2 font-bold transition',
                                            active
                                                ? 'bg-[#1f1a17] text-white hover:bg-[#1f1a17] dark:bg-orange-600 dark:text-white dark:hover:bg-[#7a2800]'
                                                : 'text-[#1f1a17]/65 hover:bg-orange-50 hover:text-[#1f1a17] dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white',
                                        )}
                                    >
                                        <Link href={item.href}>
                                            {item.icon && (
                                                <item.icon className="h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </aside>

                    <Separator className="lg:hidden dark:bg-[#2A2520]" />

                    <main className="flex-1">
                        <section className="max-w-3xl space-y-8">
                            {children}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}