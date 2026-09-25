# Architecture

## Stack

- Frontend: React 19, TypeScript, Vite, React Router, TanStack Query, Framer Motion
- Backend: Node.js, Express 5, TypeScript
- Database: MongoDB with Mongoose
- Authentication: JWT in an HTTP-only cookie
- Validation: Zod
- Security: Helmet, CORS allowlist, rate limiting, upload restrictions
- Deployment: Docker Compose, Nginx static frontend, Node API, MongoDB

## Repository

```text
apps/client  React public site and admin interface
apps/server  Express API, models, validation, uploads and seed data
docs         Architecture and admin documentation
```

## Data model

`ContentItem` is a flexible portfolio record with a controlled `type`:

- research
- project
- publication
- experience
- event
- achievement
- skill
- education
- blog
- timeline

It supports titles, Markdown content, dates, status, tags, technologies, metrics, links, media and flexible metadata. This allows the admin dashboard to manage existing and future portfolio modules without creating a new database table for each one.

`Page` stores each page’s heading, introduction, SEO metadata, visibility, order and optional custom section JSON.

`SiteSettings` stores global identity, hero copy, colors, statistics, social links, CV URL, footer and SEO defaults.

`ContactMessage` stores portfolio contact submissions and their new/read/archived status.

## API groups

- `/api/public/*` — public bootstrap data, content and contact form
- `/api/auth/*` — login, session and logout
- `/api/admin/*` — protected dashboard, CRUD, media and message operations
- `/api/health` — deployment health check

## First-run behavior

After connecting to an empty MongoDB database, the API creates the initial admin account, settings, pages and portfolio content. It only creates missing collections; normal server restarts do not overwrite edited content.
