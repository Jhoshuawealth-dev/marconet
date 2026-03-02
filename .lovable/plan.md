

# Marco Net Farming — Mobile App Implementation Plan

## Overview
A mobile-first web application for digital farming and investment, featuring a warm earth-tone design with farming metaphors blended with fintech quality. All screens will use mock/static data (frontend only, no backend).

## Design System
- **Colors**: Earth Green (#2A5F3F), Soft Clay (#D9C5A3), Charcoal (#0F0F0F), Warm White (#FAF9F6), Accent Gold (#D4AF37)
- **Style**: Rounded cards, soft shadows, calm animations, friendly icons
- **Typography**: Rounded humanist sans-serif with strong numeric hierarchy
- **Layout**: Mobile-first (max-width container), bottom tab navigation for app screens

---

## Phase 1 — Landing Page (Public Site)

A responsive public-facing landing page with:
- **Hero Section**: Bold headline, key stats, dual CTAs, farmland imagery background
- **Why Choose Us**: Benefit cards with icons (Own Your Data, Transparent Yield, etc.)
- **How It Works**: 4-step visual flow (Create Account → Farm Data → Stake → Withdraw)
- **Featured Projects**: Carousel of investment opportunities with ROI, price, timeline
- **Testimonials**: Farmer/investor quotes with avatars
- **Statistics/Trust Bar**: Lifetime farmers, total NDC paid, live streams completed
- **FAQ Section**: Accordion-style common questions
- **Footer**: Links, social icons, legal

---

## Phase 2 — Onboarding & Auth Screens

- **Splash Screen**: Logo animation with tagline
- **Onboarding Carousel**: 3 slides introducing app concepts (as shown in screenshot 1)
- **Sign In / Sign Up Pages**: Email/password forms with "Get Started" and "Sign In" options

---

## Phase 3 — Main Dashboard (Home)

The central hub showing everything at a glance (inspired by screenshot 8):
- Welcome header with avatar and notification bell
- **Total Digital Harvest** card with NDC balance and percentage change
- Yield trend chart (weekly)
- Quick action buttons: Sow, Harvest
- **Active Fields** section with farm project cards showing maturity %, APR, status badges
- Bottom tab navigation: Home, Fields, Market, Profile

---

## Phase 4 — Mining & AI Farming

- **AI Farming Control** (screenshot 9): Active field status, harvesting animation, network health indicator
- **Data Yield & Hash Power** stat cards
- **Boost Mining** action card
- **Mining History & Rewards**: List of past mining sessions with NDC earned
- **Mining Upgrades**: Available upgrades to boost efficiency
- Bottom tabs: Field, Wallet, Market, Stats

---

## Phase 5 — Wallet / NDC Bank

Based on screenshot 3:
- Total balance display with USD equivalent and change percentage
- **Fund Wallet** and **Transfer** action buttons
- **Yield Flow** bar chart (Week/Month toggle)
- **Transaction History**: Scrollable list with icons, descriptions, amounts (Harvest Reward, Staking Deposit, Withdrawal, Referral Bonus)

---

## Phase 6 — Investment & Projects

- **Invest Page**: Grid/list of farm projects to invest in
- **Project Details** (screenshot 5): Hero image with status badge, Target ROI, Duration, Risk Level, Supply Chain Flow timeline, Environmental Impact stats, Yield Generation metrics, "Increase My Stake" CTA

---

## Phase 7 — Community & Live Streaming

Based on screenshot 7:
- **Tab toggle**: Live Fields / Community
- **Live from the Fields**: Featured live stream card with viewer count, watch button, engagement stats
- **Community Discussion**: Topic filter chips, threaded discussion cards with likes/comments/shares
- Floating "+" button to create posts

---

## Phase 8 — Education Hub

Based on screenshot 6:
- Search bar for courses and certificates
- Category filter chips (All, Digital Farming, Investment)
- **Your Progress**: Current course card with module count and completion percentage, Resume button
- **Recommended for You**: Course cards with images, descriptions, Enroll buttons
- **Certificate Programs**: List of available certifications

---

## Phase 9 — Ads Manager

Based on screenshot 10:
- **Overview**: Active Campaigns count, Ad Reach stats
- **Current Campaigns**: List with campaign name, status, CTR, spend, progress bar
- **Create Campaign** page: Form with campaign details
- **Ad Performance Details**: Metrics and charts for individual campaigns
- **Billing**: Payment methods, fund wallet for ads
- Bottom tabs: Overview, Reports, Billing, Settings

---

## Phase 10 — Profile & Governance

Based on screenshot 2:
- Profile avatar with tier badge (e.g., "TIER 2: EXPERT PRODUCER")
- Member since date
- **Stats**: Proposals Voted, Governance Score
- **Community & Voting**: New proposals badge, Government Portal card with "Vote Now"
- **Account Settings**: Personal Information, Security & 2FA, Farm Assets
- Footer links: Platform Charter, Code of Conduct

---

## Navigation Structure

**Bottom Tab Bar** (contextual per section):
- Main App: Home, Fields, Market, Profile
- Mining: Field, Wallet, Market, Stats
- Community: Home, Invest, Community, Alerts, Settings
- Education: Home, Learning, Portfolio, Settings
- Ads: Overview, Reports, Billing, Settings

All sections accessible from the main dashboard which serves as the app hub.

---

## Technical Approach
- React + TypeScript with React Router for all pages
- Tailwind CSS with custom earth-tone color palette
- Recharts for yield/analytics charts
- Embla Carousel for carousels
- Lucide React icons + custom farming icons
- All data will be hardcoded mock data
- Mobile-first responsive layout (max-width ~430px centered)

