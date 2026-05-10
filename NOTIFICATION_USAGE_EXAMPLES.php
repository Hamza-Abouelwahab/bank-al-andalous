<?php

/**
 * NotificationService Usage Examples
 * 
 * This file demonstrates how to use the NotificationService in your controllers.
 * DO NOT include this file in production - it's for reference only.
 */

use App\Services\NotificationService;

// Example 1: After a successful deposit
NotificationService::create(
    userId: $user->id,
    title: 'Deposit Received',
    message: 'Your account has received 500 MAD.',
    type: 'deposit',
    icon: 'wallet',
    actionUrl: '/transactions'
);

// Example 2: After a successful withdrawal
NotificationService::create(
    userId: $user->id,
    title: 'Withdrawal Processed',
    message: 'Your withdrawal of 200 MAD has been processed.',
    type: 'withdrawal',
    icon: 'banknote',
    actionUrl: '/transactions'
);

// Example 3: After a successful transfer
NotificationService::create(
    userId: $user->id,
    title: 'Transfer Completed',
    message: 'You sent 300 MAD to account #12345.',
    type: 'transfer',
    icon: 'arrow-right-left',
    actionUrl: '/transactions'
);

// Example 4: Loan approval
NotificationService::create(
    userId: $user->id,
    title: 'Loan Approved',
    message: 'Your loan application has been approved!',
    type: 'loan',
    icon: 'check-circle',
    actionUrl: '/loans'
);

// Example 5: Saving goal milestone
NotificationService::create(
    userId: $user->id,
    title: 'Goal Milestone Reached',
    message: 'You\'ve reached 50% of your vacation savings goal!',
    type: 'saving',
    icon: 'target',
    actionUrl: '/savings/index'
);

// Example 6: Group saving invitation
NotificationService::create(
    userId: $user->id,
    title: 'Group Invitation',
    message: 'You\'ve been invited to join "Family Savings" group.',
    type: 'group',
    icon: 'users',
    actionUrl: '/savings/index'
);

// Example 7: Security alert
NotificationService::create(
    userId: $user->id,
    title: 'Security Alert',
    message: 'New login detected from a different device.',
    type: 'security',
    icon: 'shield-alert',
    actionUrl: '/settings/security'
);

// Example 8: Appointment reminder
NotificationService::create(
    userId: $user->id,
    title: 'Appointment Reminder',
    message: 'Your appointment is scheduled for tomorrow at 10:00 AM.',
    type: 'appointment',
    icon: 'calendar',
    actionUrl: '/appointments'
);
