

# NDC Economy & Community Rules Update

## What Changes

### 1. NDC Exchange Rates
Add currency conversion constants used in Transfer and Wallet pages:
- 1 NDC = £5 (GBP)
- 1 NDC = $7 (USD)
- 1 NDC = ₦11,500 (NGN)

### 2. Updated Community Rewards (currently: Like=5, Comment=10, Share=20)
- Like = **1 NDC**
- Comment = **3 NDC**
- Share = **5 NDC**
- Picture upload = **7 NDC**
- Video upload = **10 NDC**

### 3. Content Rules & Posting Limits (currently: 2 posts/day for all)
- Video posts: **1 per week**
- Picture posts: **2 per week**
- Harvest actions: **4 per month**
- All farm content must be tagged as "Real Farm" (not AI-generated) — add a checkbox/disclaimer on the post creation form

### 4. Transfer Fee
- **5% fee** on all transfers, charged in the destination currency
- Show fee breakdown before confirming transfer (amount, fee, total deducted)

---

## Files to Modify

### `src/contexts/NdcContext.tsx`
- Update reward amounts: like→1, comment→3, share→5
- Add `weeklyVideoPosts`, `weeklyPicturePosts`, `monthlyHarvests` counters
- Add `createMediaPost(type: "picture"|"video", title, body)` with weekly limits and appropriate NDC rewards
- Track harvest limit (4/month)

### `src/pages/CommunityPage.tsx`
- Update reward display text to match new values
- Expand post creation dialog: add post type selector (Text / Picture / Video)
- Add "Real Farm Content" checkbox — required before submitting picture/video posts
- Show weekly limits in the daily limits banner (videos: X/1, pictures: X/2)
- Update toast messages with new NDC amounts

### `src/pages/TransferPage.tsx`
- Add currency selector (GBP £, USD $, NGN ₦) with exchange rates
- Calculate and display 5% fee in selected currency
- Show breakdown: NDC amount → converted value → fee → net amount received
- Deduct full NDC amount (including fee equivalent) from balance

### `src/pages/WalletPage.tsx`
- Display NDC balance with equivalent values in all 3 currencies
- Show exchange rate reference

### `src/pages/DashboardPage.tsx`
- Update harvest action to respect 4/month limit

