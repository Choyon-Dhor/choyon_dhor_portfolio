# CHOYON//NEXUS

A production-oriented interactive researcher portfolio built with React, TypeScript, Node.js, Express and MongoDB. It includes a glassmorphism public experience, command terminal, canvas mini-game, blog and portfolio pages, and a secured admin dashboard for managing all site content.

## Features

- Public pages: Home, Research, Projects, Publications, Leadership, Events, Blog and Contact
- Interactive terminal with navigation commands
- Data Highway canvas mini-game with collectible achievements
- MongoDB-backed content management
- Admin dashboard with CRUD for every content type
- Editable page metadata, hero, contact details, social links and visual settings
- Media upload library
- Contact inbox with read/archive workflow
- JWT authentication in HTTP-only cookies
- Validation, rate limiting, Helmet security headers and centralized error handling
- Docker Compose deployment
- Responsive design and reduced-motion support

## Local development

1. Install Node.js 20+.
2. Create a MongoDB Atlas cluster, create a database user, and allow your IP in Network Access.
3. Copy `.env.example` to `apps/server/.env` and set `MONGODB_URI` to your Atlas connection string.
4. Change the admin credentials and JWT secret.
5. Install dependencies:

```bash
npm install
```

6. Seed the database:

```bash
npm run seed
```

7. Start both applications:

```bash
npm run dev
```

Public site: `http://localhost:5173`  
API: `http://localhost:5000/api`  
Admin: `http://localhost:5173/admin/login`

## Docker

Copy the environment file first:

```bash
cp .env.example apps/server/.env
```

Then run:

```bash
docker compose up --build
```

Open `http://localhost:8080`.

## Production notes

- Replace `JWT_SECRET` and the default admin password before deployment.
- Set `COOKIE_SECURE=true` behind HTTPS.
- Use MongoDB Atlas or a managed MongoDB service.
- Local uploads are included for easy deployment; swap the media service for S3 or Cloudinary for multi-instance production.
- Set `VITE_API_URL` at client build time to the public API URL.
