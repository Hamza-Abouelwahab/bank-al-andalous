import { usePage } from '@inertiajs/react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { url } = usePage();

    // ✅ detect modal
    const isModal = url.includes('modal=1');

    // 🔥 IF MODAL → NO SIDEBAR LAYOUT
    if (isModal) {
        return (
            <div className="min-h-screen bg-[#FFFCF9]">
                {children}
            </div>
        );
    }

    // ✅ NORMAL APP
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}