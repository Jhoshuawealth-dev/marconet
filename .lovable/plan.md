
### Activating Payment Methods (Card, Bank Transfer, USSD)

Currently, the "Fund Wallet" page is a visual simulation. To make these payment methods actually charge users and fund their wallets, we need to integrate a **Payment Gateway**. 

Given the payment options you listed (Debit Card, Bank Transfer, USSD) and the presence of the Naira (₦) currency in your wallet, the most suitable payment gateways for your platform would be **Paystack** or **Flutterwave**. 

Here is the plan on how we can activate them:

#### Option 1: Integrate Paystack or Flutterwave (Recommended for USSD/Bank Transfer)
These providers natively support Nigerian Debit Cards, Bank Transfers, and USSD.
1. **Setup Account:** You create a free account on Paystack or Flutterwave and get your API keys.
2. **Secure the Keys:** We will store your API Secret Keys securely in Lovable Cloud (Supabase) secrets.
3. **Backend Integration:** I will create a secure **Edge Function** in your backend. When a user clicks "Fund Wallet", the app calls this function to generate a secure payment link or popup.
4. **Webhook Setup:** I will set up a webhook so that when the payment is successful (whether by card, transfer, or USSD), the gateway automatically tells your backend to add the exact NDC amount to the user's `ndc_balance` in the database.
5. **Frontend Update:** Update the UI to launch the payment modal instead of faking the success message.

#### Option 2: Integrate Stripe (Built-in Lovable Integration)
If you prefer an international provider, Lovable has a built-in **Stripe** integration. 
* *Pros:* Very easy to activate instantly via a tool I can run right now.
* *Cons:* Stripe is primarily focused on Credit/Debit Cards globally. USSD and local Nigerian Bank Transfers aren't supported in the same seamless way as Paystack.

---

### How to proceed?
If you want to use **Stripe**, let me know and I can trigger the built-in Stripe tool right away to collect your API keys and set it up!

If you prefer **Paystack** or **Flutterwave**, simply reply with which one you'd prefer to use. I will then guide you on how to provide the API keys, and I'll write the complete backend and frontend code to make the payments live.
