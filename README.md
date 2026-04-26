# AdRelo — The Agency Engine

Run your advertising agency like a machine.

## Overview

AdRelo is a modern SaaS platform designed for advertising agencies to manage release orders, clients, billing, and GST workflows in one clean system.

## Features

- **Release Order Management** — Create, track, and manage ROs with auto-calculated pricing
- **Client Management** — Maintain a searchable client directory
- **Invoice & Billing System** — Generate bills linked to release orders
- **PDF Generation** — Professional, branded PDF exports for ROs and invoices
- **GST Calculation** — Automatic GST computation with reports
- **Trial to Pro Upgrade** — Built-in upgrade flow with Razorpay payment integration
- **Google & Email Auth** — Supabase-powered authentication

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Supabase
- **Payments:** Razorpay
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd AdRelo

# Install dependencies
npm install

# Add environment variables
cp .env.local.example .env.local
# Fill in the values below

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key ID (public) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret (server-only) |

## Pricing

| Plan | Limit | Price |
|---|---|---|
| Trial | 10 Release Orders / month | Free |
| Pro | Unlimited | Rs. 999/month |
| Business | Unlimited + team features | Coming soon |

## License

See [LICENSE](./LICENSE) file.

## Author

Himanshu Dhingra
