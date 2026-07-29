## Goal
Rebuild vointy.io in Lovable as a refreshed, multi-language marketing site that preserves the current vointy.io content and brand feel, then wire it to Lovable Cloud backend services so it can later be wrapped as a Capacitor native app.

## What we will build

### 1. Refreshed homepage (vointy.io content)
- Hero: "Vointy is your team's collective motivator" with CTA buttons and trusted-by avatars.
- Free/team intro cards and the "For Companies" pricing teaser (€2.90 / person / month).
- Numbered challenge examples (Recovery, Move more, Ergonomics, Team challenges, Healthy routines).
- "A Social Platform Employees Will Love" feature section with app screenshots.
- "Why Vointy works" explanation section.
- Embedded presentation video (YouTube/Vimeo placeholder).
- License/reseller CTA and a working contact form.
- Newsletter signup footer block.

### 2. Multi-language support (9 languages)
- English, German, French, Spanish, Italian, Finnish, Swedish, Dutch, Danish.
- Language switcher in the header, persisted in localStorage.
- All homepage strings extracted to translation files.

### 3. Authentication & user profiles
- Email/password sign-up, login, logout, password reset.
- Google sign-in.
- `profiles` table linked to `auth.users` with display name, avatar URL, language preference, and role.
- Auto-create profile on sign-up via database trigger.
- Protected `/dashboard` or `/account` route placeholder for logged-in users.

### 4. Contact form & newsletter backend
- Contact submissions stored in a `contact_submissions` table.
- Newsletter subscribers stored in a `newsletter_subscribers` table.
- RLS policies so only admins can read; public can insert.

### 5. Paid subscriptions
- Paddle is the recommended provider for this B2B SaaS product.
- After you confirm, enable Paddle and create subscription products/prices.
- Build a pricing/subscription page with Paddle checkout buttons.

### 6. Placeholder assets
- Generate placeholder hero/feature images and a Vointy-style logo.
- You can replace placeholders with original assets later without changing code.

### 7. SEO / head metadata
- Update `index.html` title/description to match Vointy.
- Add canonical, OpenGraph, and Twitter tags.

### 8. Capacitor readiness (after site is live)
- Install Capacitor core + iOS/Android.
- Configure app ID/name and hot-reload server URL.
- Keep web layer as the single source of truth so the same code can be published to App Store / Google Play.

## Technical approach
- Frontend: existing React + Vite + Tailwind + shadcn/ui project.
- Backend: Lovable Cloud (already enabled) for auth, database, and edge functions.
- Payments: Lovable-managed Paddle integration.
- i18n: lightweight in-app dictionary (e.g. `i18next` or custom hook) to avoid external service dependencies.
- Images: generated placeholders under `public/`, referenced as static assets.

## Milestones / order of work
1. Refresh homepage layout and content (placeholders, no backend).
2. Add i18n framework and translate all homepage strings.
3. Set up auth + profiles table + login/reset pages.
4. Build contact form and newsletter tables/backend.
5. Enable Paddle, create products, and build pricing/subscription page.
6. Polish responsive design, SEO metadata, and preview.
7. Add Capacitor config and instructions for native builds.

## Open decisions
- Please confirm Paddle for subscriptions so we can enable it.
- Should the first version include an admin dashboard to view contact/newsletter submissions, or is email notification enough?
- For the embedded "presentation video", do you have a YouTube/Vimeo URL, or should we use a placeholder video thumbnail?
