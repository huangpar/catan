This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Database (Netlify Database)

This app uses [Netlify Database](https://docs.netlify.com/build/data-and-storage/netlify-database/) via `@netlify/database` and the `NETLIFY_DB_URL` connection string.

1. Link the site and provision a database (one-time):

   ```bash
   netlify link
   netlify database init
   ```

2. Run locally with the embedded Postgres database:

   ```bash
   npm run dev:netlify
   ```

   `netlify dev` starts Next.js and sets `NETLIFY_DB_URL` automatically.

   Alternatively, run `netlify database status --show-credentials`, copy the connection string into `.env.local` as `NETLIFY_DB_URL`, then use `npm run dev`.

3. On Netlify deploys, `NETLIFY_DB_URL` is injected when `@netlify/database` is installed—no Neon `DATABASE_URL` needed.

Tables are created on first request via `lib/initDb.js` (seed data in `lib/schema.sql`).

### Development server

```bash
npm run dev:netlify
# or, with NETLIFY_DB_URL set in .env.local:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
