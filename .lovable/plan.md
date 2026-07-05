# Make Marco Net responsive on tablet + desktop

Today every app page is locked to a 430px centered column, even on wide screens. The landing pages already scale. Goal: keep the current mobile feel identical, and unlock proper tablet (≥768px) and desktop (≥1024px) layouts everywhere else.

## Approach

Introduce one shared responsive shell instead of touching each page's outer wrapper by hand, then upgrade the heavy pages to real multi-column layouts.

### 1. Responsive app shell

Create `src/components/app/AppShell.tsx`:

- Mobile (`<md`): unchanged — 430px centered column, bottom nav visible.
- Tablet (`md` – `lg`): 720px content column, more breathing room, bottom nav still visible.
- Desktop (`≥lg`): left sidebar nav (Dashboard, Mining, Wallet, Invest, Community, Education, Ads, Profile) + a 1120px max content area; bottom nav hidden.

Update `BottomNav` to hide at `lg:` and add a matching `SideNav` used only at `lg:`.

Wrap every protected/admin page in `AppShell` via `ProtectedRoute` / `AdminRoute` (single edit, propagates everywhere) and drop the per-page `max-w-[430px]` wrapper by rewriting the shared container class.

### 2. Grid upgrades on the heavy pages

These pages get true multi-column layouts at `md:` and `lg:` (single column stays on mobile):


| Page                                                                                                                   | md (2 col)                                      | lg (3+ col)                                                          |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| Dashboard                                                                                                              | balance + chart side-by-side, quick actions row | + activity + announcements column                                    |
| Wallet                                                                                                                 | balance card + transactions                     | + fund/transfer side panel                                           |
| Invest / Fields / Market                                                                                               | 2-up project cards                              | 3-up cards, filters as sidebar                                       |
| Community                                                                                                              | 2-up post grid                                  | 3-up feed + right rail (trending)                                    |
| Education                                                                                                              | 2-up course cards                               | 3-up + progress sidebar                                              |
| Ads Manager, Campaign Detail                                                                                           | metrics 2-up, table wider                       | metrics 4-up, chart full width                                       |
| Notifications, Referrals, Farm Assets, Profile subpages                                                                | 2-up cards where lists                          | same, wider table                                                    |
| Admin (Users, Transactions, Moderation, Stakes, Verification, Requests, Analytics, Announcements, Education, Settings) | full-width tables, side filter panel            | proper admin dashboard: sidebar + wide tables + inline detail drawer |


Charts (`recharts`) get `ResponsiveContainer` widths already; only their card grids change.

### 3. Landing pages

Already responsive — quick pass to fix any remaining fixed widths in `HeroSection`, `FeaturedProjects`, `Footer`, `WhyChooseUs`.

### 4. Global polish

- Replace `max-w-[430px] mx-auto` occurrences with the shell (search-replace across ~30 pages).
- Bump tap targets and font sizes only where they get too small on wide screens.
- Modals/sheets: switch bottom sheets to centered dialogs at `md:` and up.
- Header/toolbars on desktop: move the mobile top-bar actions into the side nav.

## Non-goals

- No visual redesign — same earth-tone palette, same typography, same components. Only layout scales.
- No new features.
- No changes to business logic, RPCs, or Supabase schema.

## Rollout order

1. Shell + SideNav + BottomNav hide-at-lg + wire through `ProtectedRoute`/`AdminRoute`.
2. Dashboard, Wallet, Invest, Community, Education, Profile (highest traffic).
3. Ads, Notifications, Referrals, Farm Assets, remaining user pages.
4. All admin pages.
5. Landing polish pass.
6. Manual check at 320 / 390 / 768 / 1024 / 1440 widths.

## Technical notes

- Update `mem://index.md` Core: the 430px lock now applies only to mobile breakpoint.
- Tailwind breakpoints stay default (`sm 640 / md 768 / lg 1024 / xl 1280`).
- Container utility added in `tailwind.config.ts` or as a component class in `index.css`, e.g. `.app-container { @apply w-full max-w-[430px] mx-auto md:max-w-3xl lg:max-w-6xl px-4 md:px-6; }`.
- Side nav reuses `NavLink` styling; active state via `useLocation`.
- `AppShell` accepts `variant="user" | "admin"` so admin gets the admin nav items and the wider table container.
- Framer-motion page transitions kept; wrap the main content, not the shell.  
  
5.  Also add image (related images on the landing page and also on the entire website) images that is necceary and where necceasry
- &nbsp;