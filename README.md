# CMS

Next.js 14 + MySQL CMS deployed on Vercel with Hostinger MySQL.

## Deploy to Vercel

1. Push to GitHub
2. Import on vercel.com
3. Set environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NEXTAUTH_SECRET, NEXTAUTH_URL, SITE_URL, SITE_NAME)
4. Deploy

## Create Tables

Use the `debug.php` file or Hostinger phpMyAdmin to create the 17 required tables.

## Local Development

```bash
npm install --legacy-peer-deps
cp .env.example .env  # fill in values
npm run dev
```
