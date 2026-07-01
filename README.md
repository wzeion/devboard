# DevBoard

A full-stack developer task and project management tool with Kanban board, authentication, and activity logging.

## 🚧 Status
In active development — Auth complete, Projects CRUD in progress.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon)
- Prisma ORM v5
- NextAuth.js v5

## Features
- [x] Email/password authentication
- [x] Google OAuth
- [x] JWT session management
- [x] Protected routes via middleware
- [ ] Project management (CRUD)
- [ ] Kanban board with drag and drop
- [ ] Activity logging
- [ ] Dashboard with stats

## Getting Started

```bash
git clone https://github.com/yourusername/devboard.git
cd devboard
npm install
```

Create a `.env` file:
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Then:
```bash
npx prisma generate
npx prisma db push
npm run dev
```