import { router, usePage } from '@inertiajs/react';
import {
    Bell,
    Check,
    Trash2,
    X,
    Wallet,
    ArrowUpFromLine,
    ArrowDownToLine,
    Send,
    Target,
    Users,
    ShieldAlert,
    Calendar,
    CheckCircle,
    AlertCircle,
    Info,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    icon: string | null;
    action_url: string | null;
    is_read: boolean;
    created_at: string;
}

const iconMap: Record<string, any> = {
    wallet: Wallet,
    banknote: ArrowUpFromLine,
    'arrow-down-to-line': ArrowDownToLine,
    'arrow-up-from-line': ArrowUpFromLine,
    'arrow-right-left': Send,
    send: Send,
    target: Target,
    users: Users,
    'shield-alert': ShieldAlert,
    calendar: Calendar,
    'check-circle': CheckCircle,
    'alert-circle': AlertCircle,
    info: Info,
};

export function NotificationBell() {
    const { notifications = [], unreadNotificationsCount = 0 } = usePage<any>().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleMarkAsRead = async (notificationId: number, actionUrl: string | null) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch(`/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                router.reload({ only: ['notifications', 'unreadNotificationsCount'] });
                if (actionUrl) {
                    router.visit(actionUrl);
                    setIsOpen(false);
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch('/notifications/read-all', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                router.reload({ only: ['notifications', 'unreadNotificationsCount'] });
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handleClearAll = async () => {
        if (confirm('Are you sure you want to clear all notifications?')) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const response = await fetch('/notifications/clear-all', {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    router.reload({ only: ['notifications', 'unreadNotificationsCount'] });
                }
            } catch (error) {
                console.error('Error clearing notifications:', error);
            }
        }
    };

    const handleDelete = async (notificationId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch(`/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                router.reload({ only: ['notifications', 'unreadNotificationsCount'] });
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getIconComponent = (iconName: string | null) => {
        if (!iconName) return Bell;
        return iconMap[iconName] || Bell;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                className="group relative h-9 w-9 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-lg shadow-orange-600/30">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#EDE8E0] bg-white shadow-2xl shadow-orange-900/10 dark:border-[#2A2520] dark:bg-[#1A1714]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#EDE8E0] px-4 py-3 dark:border-[#2A2520]">
                        <div>
                            <h3 className="text-sm font-bold text-[#1f1a17] dark:text-white">
                                Notifications
                            </h3>
                            {unreadNotificationsCount > 0 && (
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                    {unreadNotificationsCount} unread
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#1f1a17]/60 transition hover:bg-[#f8f6f1] hover:text-[#1f1a17] dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[480px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-[#EDE8E0] dark:divide-[#2A2520]">
                                {notifications.map((notification: Notification) => {
                                    const IconComponent = getIconComponent(notification.icon);
                                    return (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleMarkAsRead(notification.id, notification.action_url)}
                                            className={`group relative cursor-pointer px-4 py-3 transition hover:bg-[#f8f6f1] dark:hover:bg-white/5 ${
                                                !notification.is_read
                                                    ? 'bg-orange-50/40 dark:bg-orange-500/5'
                                                    : ''
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                        !notification.is_read
                                                            ? 'bg-orange-100 dark:bg-orange-500/20'
                                                            : 'bg-[#f8f6f1] dark:bg-white/10'
                                                    }`}
                                                >
                                                    <IconComponent
                                                        className={`h-5 w-5 ${
                                                            !notification.is_read
                                                                ? 'text-orange-600 dark:text-orange-400'
                                                                : 'text-[#1f1a17]/60 dark:text-white/60'
                                                        }`}
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p
                                                            className={`text-sm font-bold ${
                                                                !notification.is_read
                                                                    ? 'text-[#1f1a17] dark:text-white'
                                                                    : 'text-[#1f1a17]/80 dark:text-white/80'
                                                            }`}
                                                        >
                                                            {notification.title}
                                                        </p>
                                                        {!notification.is_read && (
                                                            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-orange-600 dark:bg-orange-400" />
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs leading-relaxed text-[#1f1a17]/60 dark:text-white/60">
                                                        {notification.message}
                                                    </p>
                                                    <p className="mt-1.5 text-xs font-medium text-[#1f1a17]/40 dark:text-white/40">
                                                        {getTimeAgo(notification.created_at)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={(e) => handleDelete(notification.id, e)}
                                                    className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-lg text-[#1f1a17]/40 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center px-6 py-12 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f6f1] dark:bg-white/5">
                                    <Bell className="h-8 w-8 text-[#1f1a17]/30 dark:text-white/30" />
                                </div>
                                <p className="text-sm font-bold text-[#1f1a17] dark:text-white">
                                    No notifications yet
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-[#1f1a17]/60 dark:text-white/60">
                                    Your important account updates will appear here.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {notifications.length > 0 && (
                        <div className="flex items-center gap-2 border-t border-[#EDE8E0] px-4 py-3 dark:border-[#2A2520]">
                            {unreadNotificationsCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={handleClearAll}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
