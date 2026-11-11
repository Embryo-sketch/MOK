# Supabase setup

1. Create a Supabase project and open **SQL Editor**.
2. Run [`schema.sql`](./schema.sql). It creates the shared site content and admin allowlist tables with row-level security enabled.
3. In **Authentication → Providers**, keep Email enabled and turn off public sign-ups.
4. In **Authentication → Users**, create the admin account using the one email address you want to permit at `/admin`. Disable public sign-ups so visitors cannot create accounts.
5. In SQL Editor, run the final `insert into public.site_admins` statement from `schema.sql`, replacing `YOUR-ADMIN-EMAIL@example.com` with the exact email address for the admin account.
6. Copy `.env.example` to `.env.local`, then add the project URL and publishable (or legacy anon) key from **Project Settings → API Keys**. These are public client credentials; never put the service-role key in the website.
7. Add the same two environment variables to the Vercel project before deploying.

The public website reads the shared content row. The admin dashboard uses Supabase email/password authentication and can update that row only when the signed-in account's email exactly matches an entry in `site_admins`.
