## Implementation Plan: 5 Feature Upgrades

### 1. Real-time Updates for Admin Stakes, Education, Users Pages

Add Supabase realtime channel subscriptions (same pattern as AdminDashboardPage) to these three pages so data refreshes automatically when changes occur.

**Files to edit:**

- `src/pages/admin/AdminUsersPage.tsx` — subscribe to `profiles` table changes
- `src/pages/admin/AdminStakesPage.tsx` — subscribe to `staked_projects` table changes
- `src/pages/admin/AdminEducationPage.tsx` — subscribe to `enrolled_courses` table changes

Each page gets a channel subscription in useEffect with cleanup on unmount, re-fetching data on any insert/update/delete.

---

### 2. Real Notification System with Database Storage

Create a `notifications` table and replace the current transaction-only notifications with a proper system that tracks announcements, post approvals, stake events, and more.

**Database migration:**

- Create `notifications` table: `id`, `user_id`, `title`, `body`, `type` (announcement, post_approval, stake_maturity, system), `read` (boolean, default false), `created_at`
- RLS: users can read/update own notifications; admins can insert for any user
- Enable realtime on the table

**Files to create/edit:**

- `src/hooks/useNotifications.ts` — hook to fetch, mark-read, and subscribe to realtime notifications
- `src/pages/NotificationsPage.tsx` — rewrite to pull from database instead of NdcContext transactions
- `src/pages/admin/AdminAnnouncementsPage.tsx` — when publishing an announcement, insert a notification row per user (via a database function to batch-insert)
- Create DB function `notify_all_users` that inserts a notification for every user when an announcement is published

---

### 3. Profile Photo Upload

Create a storage bucket and let users upload an avatar image from their profile.

**Database migration:**

- Create `avatars` storage bucket (public)
- RLS policies: authenticated users can upload/update/delete their own files (path pattern: `{user_id}/*`)

**Files to edit:**

- `src/pages/ProfilePage.tsx` — add camera icon overlay on avatar circle; on click, open file picker, upload to storage, update `profiles.avatar_url`
- `src/pages/PersonalInfoPage.tsx` — show avatar with upload option
- Any component showing user avatar — fall back to initials if no `avatar_url`

---

### 4. Real KYC Verification Flow

Make the verification page actually upload documents, persist status, and let admins review.

**Database migration:**

- Create `verification_requests` table: `id`, `user_id`, `id_type`, `document_url`, `selfie_url`, `status` (pending/approved/rejected), `reviewed_by`, `reviewed_at`, `created_at`
- RLS: users can insert/view own; admins can view all and update status
- Create `kyc-documents` storage bucket (private) with user-scoped RLS

**Files to edit:**

- `src/pages/VerificationPage.tsx` — replace simulated flow with real file upload (document photo + selfie) to storage, then insert `verification_requests` row
- `src/pages/admin/AdminUsersPage.tsx` or new `AdminVerificationPage.tsx` — list pending verification requests, view documents, approve/reject
- `src/components/admin/AdminLayout.tsx` — add KYC/Verification nav item
- `src/App.tsx` — add route for admin verification page
- `src/pages/ProfilePage.tsx` — show verification badge based on DB status

---

---

### Technical Summary


| Feature          | DB Changes                              | Storage                | Edge Functions  | Files Changed |
| ---------------- | --------------------------------------- | ---------------------- | --------------- | ------------- |
| Admin realtime   | Enable realtime on 3 tables             | -                      | -               | 3             |
| Notifications    | New `notifications` table + DB function | -                      | -               | 3-4           |
| Profile photo    | `avatars` bucket                        | Yes                    | -               | 2-3           |
| KYC verification | New `verification_requests` table       | `kyc-documents` bucket | -               | 4-5           |
| Paystack         | New `payment_transactions` table        | -                      | 2 new functions | 1-2           |


### Execution Order

1. Admin realtime (quick, no dependencies)
2. Notifications system (enables announcements to work end-to-end)
3. Profile photo upload (storage bucket + UI)
4. KYC verification (storage + new table + admin page)
5. Paystack integration (requires API key from you first)