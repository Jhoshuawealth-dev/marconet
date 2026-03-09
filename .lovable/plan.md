

## What's Missing from the Admin Section

Comparing the admin panel against the full app feature set, here are the gaps:

### Currently in Admin
- Dashboard (KPIs + chart)
- Users (list + search)
- Moderation (approve/reject posts)
- Transactions (list + search)
- Admin Requests (super_admin only)

### What Should Be Added

**1. Staking / Investment Management**
- View all staked projects across users (data exists in `staked_projects` table)
- See total staked NDC, top projects, active stakes over time

**2. Education / Courses Overview**
- View enrolled courses stats from `enrolled_courses` table
- See which courses are most popular, enrollment trends

**3. Settings Page**
- Platform-level settings: toggle features, manage announcement banners
- Admin activity log / audit trail

**4. User Detail View**
- Click a user in the Users page to see their full profile, transactions, stakes, and posts in one place
- Ability to suspend/ban (add `status` column to profiles)

**5. Notification / Announcement Broadcast**
- Send platform-wide announcements or targeted notifications to users

**6. Analytics Page (deeper)**
- User growth chart over time (daily/weekly signups)
- NDC circulation metrics (mined vs spent vs staked)
- Community engagement stats (posts per day, comments)

### Implementation Plan

| Item | Pages/Components | DB Changes |
|---|---|---|
| Staking management | `/admin/stakes` — new page | None (RLS already allows admin reads) |
| Education overview | `/admin/education` — new page | None (need admin RLS on `enrolled_courses`) |
| User detail view | `/admin/users/:id` — new page | None |
| Analytics page | `/admin/analytics` — new page with Recharts | None |
| Settings page | `/admin/settings` — new page | New `platform_settings` table |
| Announcements | `/admin/announcements` — new page | New `announcements` table |

**DB migration needed for:**
- Add admin SELECT RLS policy on `enrolled_courses`
- Create `platform_settings` table (key-value store)
- Create `announcements` table (title, body, target, created_by, created_at)

**Nav updates:**
- Add new items to `AdminLayout.tsx` sidebar: Stakes, Education, Analytics, Settings, Announcements

All pages follow the existing admin design pattern (AdminLayout wrapper, premium card styling, search/filter bars, Recharts for charts).

