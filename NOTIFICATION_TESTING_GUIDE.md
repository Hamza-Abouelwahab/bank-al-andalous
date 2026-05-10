# Quick Start Guide - Testing Notifications

## 🚀 Test Your Notification System

The notification system is now live! Here's how to test it:

---

## Method 1: Using Tinker (Recommended)

```bash
php artisan tinker
```

Then run:

```php
use App\Services\NotificationService;
use App\Models\User;

// Get your user
$user = User::first(); // or User::find(YOUR_USER_ID)

// Create a test notification
NotificationService::create(
    userId: $user->id,
    title: 'Welcome to Notifications! 🎉',
    message: 'Your notification system is working perfectly. Click to test navigation.',
    type: 'system',
    icon: 'check-circle',
    actionUrl: '/dashboard'
);

// Create more test notifications
NotificationService::create(
    userId: $user->id,
    title: 'Deposit Received',
    message: 'Your account has received 500 MAD.',
    type: 'deposit',
    icon: 'wallet',
    actionUrl: '/transactions'
);

NotificationService::create(
    userId: $user->id,
    title: 'Saving Goal Milestone',
    message: 'You\'ve reached 50% of your vacation savings goal!',
    type: 'saving',
    icon: 'target',
    actionUrl: '/savings/index'
);

NotificationService::create(
    userId: $user->id,
    title: 'Security Alert',
    message: 'New login detected from a different device.',
    type: 'security',
    icon: 'shield-alert',
    actionUrl: '/settings/security'
);
```

---

## Method 2: Using API (Postman/cURL)

You can also test via the API routes:

### Get Notifications
```bash
GET /notifications
```

### Mark as Read
```bash
POST /notifications/{id}/read
```

### Mark All as Read
```bash
POST /notifications/read-all
```

### Delete Notification
```bash
DELETE /notifications/{id}
```

### Clear All
```bash
DELETE /notifications/clear-all
```

---

## Method 3: Direct Database Insert

```sql
INSERT INTO notifications (user_id, title, message, type, icon, action_url, is_read, created_at, updated_at)
VALUES (1, 'Test Notification', 'This is a test message.', 'test', 'info', '/dashboard', 0, NOW(), NOW());
```

---

## ✅ What to Check

After creating notifications:

1. **Bell Icon Badge**
   - Should show unread count (e.g., "3")
   - Should show "9+" for 10 or more

2. **Click Bell**
   - Dropdown should open
   - Should show your notifications
   - Latest first

3. **Unread Notifications**
   - Orange background tint
   - Orange icon
   - Orange dot indicator
   - Bold text

4. **Click Notification**
   - Should mark as read
   - Should navigate to action_url (if provided)
   - Dropdown should close

5. **Hover Notification**
   - Delete button should appear
   - Background should highlight

6. **Click Delete**
   - Should remove notification
   - UI should update immediately

7. **Mark All Read**
   - Button only shows if unread exist
   - Should mark all as read
   - Badge should disappear

8. **Clear All**
   - Should show confirmation
   - Should delete all notifications
   - Should show empty state

9. **Empty State**
   - Bell icon in gray circle
   - "No notifications yet" message
   - Helpful description

10. **Dark Mode**
    - Toggle dark mode
    - Check colors and contrast
    - Verify orange accents

---

## 🎯 Expected Behavior

### Bell Icon States
- **No notifications**: No badge
- **1-9 unread**: Shows number (e.g., "3")
- **10+ unread**: Shows "9+"

### Notification States
- **Unread**: Orange tint, bold, dot indicator
- **Read**: White/gray, normal weight, no dot

### Time Display
- **< 1 min**: "Just now"
- **< 1 hour**: "5m ago"
- **< 1 day**: "2h ago"
- **< 1 week**: "3d ago"
- **> 1 week**: "Jan 15"

---

## 🐛 Troubleshooting

### Bell icon not showing
- Check if you're logged in
- Check if NotificationBell is imported in app-header.tsx

### No notifications showing
- Check database: `SELECT * FROM notifications WHERE user_id = YOUR_ID;`
- Check Inertia props in browser DevTools

### Badge not updating
- Hard refresh (Ctrl+Shift+R)
- Check unreadNotificationsCount in Inertia props

### Dropdown not opening
- Check browser console for errors
- Verify Button component is imported

### Dark mode issues
- Toggle theme and check
- Verify Tailwind dark: classes

---

## 📝 Example Test Script

Run this in Tinker to create a full set of test notifications:

```php
use App\Services\NotificationService;
use App\Models\User;

$user = User::first();

// Banking
NotificationService::create($user->id, 'Deposit Received', 'Your account has received 500 MAD.', 'deposit', 'wallet', '/transactions');
NotificationService::create($user->id, 'Withdrawal Processed', 'Your withdrawal of 200 MAD has been processed.', 'withdrawal', 'banknote', '/transactions');
NotificationService::create($user->id, 'Transfer Completed', 'You sent 300 MAD to account #12345.', 'transfer', 'send', '/transactions');

// Savings
NotificationService::create($user->id, 'Goal Created', 'Your vacation savings goal has been created.', 'saving', 'target', '/savings/index');
NotificationService::create($user->id, 'Milestone Reached', 'You\'ve reached 50% of your goal!', 'saving', 'target', '/savings/index');

// Group
NotificationService::create($user->id, 'Group Invitation', 'You\'ve been invited to join "Family Savings".', 'group', 'users', '/savings/index');

// Security
NotificationService::create($user->id, 'Security Alert', 'New login detected from Chrome on Windows.', 'security', 'shield-alert', '/settings/security');

// Appointment
NotificationService::create($user->id, 'Appointment Confirmed', 'Your appointment is scheduled for tomorrow at 10:00 AM.', 'appointment', 'calendar', '/appointments');

echo "✅ Created 8 test notifications!\n";
```

---

## 🎨 Visual Check

Your notification bell should look like this:

```
┌─────────────────────────────────────┐
│  🔔 (3)  ← Bell with badge          │
└─────────────────────────────────────┘

When clicked:
┌─────────────────────────────────────┐
│ Notifications          3 unread  ✕  │
├─────────────────────────────────────┤
│ 💰 Deposit Received            •    │
│ Your account has received...        │
│ 5m ago                              │
├─────────────────────────────────────┤
│ 🎯 Goal Milestone                   │
│ You've reached 50% of your...       │
│ 2h ago                              │
├─────────────────────────────────────┤
│ 🛡️ Security Alert                   │
│ New login detected from...          │
│ 1d ago                              │
├─────────────────────────────────────┤
│ [Mark all read] [Clear all]         │
└─────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Bell icon visible in header
- [ ] Badge shows unread count
- [ ] Dropdown opens on click
- [ ] Notifications display correctly
- [ ] Icons show properly
- [ ] Time ago displays correctly
- [ ] Unread notifications highlighted
- [ ] Click marks as read
- [ ] Navigation works
- [ ] Delete button appears on hover
- [ ] Delete works
- [ ] Mark all read works
- [ ] Clear all works (with confirmation)
- [ ] Empty state shows correctly
- [ ] Dark mode works
- [ ] Responsive on mobile
- [ ] Click outside closes dropdown

---

## 🎉 Next Steps

Once testing is complete:

1. ✅ Integrate notifications in deposit controller
2. ✅ Integrate notifications in withdrawal controller
3. ✅ Integrate notifications in transfer controller
4. ✅ Integrate notifications in loan controllers
5. ✅ Integrate notifications in saving goal controllers
6. ✅ Integrate notifications in group saving controllers
7. ✅ Integrate notifications in appointment controllers
8. ✅ Add security event notifications

---

**Happy Testing! 🚀**

If everything works, you're ready to integrate notifications into your business logic!
