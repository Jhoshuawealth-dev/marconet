

## Admin Section Plan

### Database Changes

1. **`user_roles` table** with `app_role` enum (`admin`, `super_admin`, `user`) — stores role assignments, secured by RLS so only admins/super_admins can read/manage roles.

2. **`admin_requests` table** — users can submit a request for admin access; super_admins approve/reject. Columns: `user_id`, `status` (pending/approved/rejected), `requested_at`, `reviewed_by`, `reviewed_at`.

3. **`has_role()` security definer function** — prevents RLS recursion when checking roles in policies.

4. **RLS policies** on `user_roles` and `admin_requests` tables, plus updated policies on existing tables (e.g., `community_posts`, `profiles`, `ndc_transactions`) to grant admin read access.

### Pages & Routes

All admin routes under `/admin/*`, protected by a new `AdminRoute` wrapper that checks `has_role(uid, 'admin')` or `'super_admin'`.

| Route | Purpose |
|---|---|
| `/admin` | Dashboard with KPI cards: total users, total NDC mined, pending posts, active stakes |
| `/admin/users` | User list with search, view profiles, suspend/delete accounts |
| `/admin/moderation` | Pending community posts queue — approve/reject with one click |
| `/admin/transactions` | All NDC transactions across platform, filterable by user/type/date |
| `/admin/requests` | Admin access requests — super_admin approves/rejects (only visible to super_admins) |

### Components

- **`AdminLayout.tsx`** — sidebar navigation for admin pages (separate from the main app bottom nav)
- **`AdminRoute.tsx`** — checks user role via a DB query, redirects non-admins to `/dashboard`
- **Admin dashboard cards** — query aggregate data from profiles, transactions, community_posts tables

### Access Flow

1. Authenticated user navigates to `/admin/request` and submits a request
2. Request is stored in `admin_requests` with status `pending`
3. A super_admin views `/admin/requests`, approves → inserts row into `user_roles`
4. User now sees admin nav and can access `/admin/*`

### Bootstrap

The first super_admin will be seeded via a migration (your email/user_id) since there's no existing admin to approve the first one.

### Security

- All admin queries use the `has_role()` security definer function
- Role checks happen server-side via RLS — no client-side role storage
- Admin routes are both client-gated (redirect) and server-gated (RLS denies data)

