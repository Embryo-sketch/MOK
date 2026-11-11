# MOK Limited website

Next.js, TypeScript and Tailwind CSS website with a Supabase-backed admin dashboard.

## Local setup

1. Install dependencies with `npm install`.
2. Create a Supabase project and follow [`supabase/README.md`](./supabase/README.md) to create the database and admin account.
3. Copy `.env.example` to `.env.local`, then set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY` for a legacy project).
4. Run `npm run dev` and open `http://localhost:3000`. The admin sign-in is at `http://localhost:3000/admin`.

The site can display its built-in preview content before Supabase is configured. Admin changes are saved in Supabase and shared with site visitors.
