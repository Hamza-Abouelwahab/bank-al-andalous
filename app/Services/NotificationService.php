<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public static function create(
        int $userId,
        string $title,
        string $message,
        string $type,
        ?string $icon = null,
        ?string $actionUrl = null
    ): ?Notification {
        try {
            return Notification::create([
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'icon' => $icon,
                'action_url' => $actionUrl,
                'is_read' => false,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create notification', [
                'user_id' => $userId,
                'title' => $title,
                'error' => $e->getMessage(),
            ]);
            
            return null;
        }
    }
}
