# Start Here — CHOYON//NEXUS

## Fastest setup with direct MongoDB Atlas

1. Install Node.js 20 or newer.
2. Open the project folder in VS Code.
3. Create a free MongoDB Atlas cluster.
4. In Atlas, create a database user with read/write access.
5. In Atlas Network Access, allow your current IP address.
6. Copy the connection string and replace `<password>` with the database user's password.
7. Put that full connection string into `apps/server/.env` as `MONGODB_URI`.
8. Change `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the same file.
9. Open a terminal in the project root and run:

```bash
npm install
npm run dev
```

The server automatically creates the database, admin account and starter portfolio data on its first successful Atlas connection.

- Portfolio: http://localhost:5173
- Admin: http://localhost:5173/admin/login
- API health: http://localhost:5000/api/health

Example `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@cluster0.xxxxx.mongodb.net/choyon_nexus?retryWrites=true&w=majority&appName=Cluster0
```

## Production build

```bash
npm run typecheck
npm run build
npm run start
```

Serve `apps/client/dist` from Nginx, Netlify, Vercel, Cloudflare Pages or another static host. Deploy `apps/server` to a Node.js host and set `VITE_API_URL` to the public API URL when building the client.

## Optional Docker Compose

```bash
cp .env.example apps/server/.env
docker compose up --build
```

Open http://localhost:8080.

## First security tasks

- Never deploy the example admin password.
- Use a random JWT secret with at least 32 characters.
- Set `COOKIE_SECURE=true` when the website uses HTTPS.
- Restrict `CLIENT_URL` to the exact production frontend origin.
