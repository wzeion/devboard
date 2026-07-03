# DevBoard

A full-stack developer task and project management tool with Kanban board, authentication, and activity logging.

## 🚧 Status
In active development — Projects CRUD complete, Tasks & Kanban in progress.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon)
- Prisma ORM v5
- NextAuth.js v5

## Features
- [x] Dashboard with stats (total projects, tasks, completed, in progress)
- [x] Bar chart showing tasks by status
- [x] Real-time activity log
- [x] Navigation bar across all pages
- [ ] Dark mode toggle
- [ ] Task filters
- [ ] Deployment

## Getting Started

```bash
git clone https://github.com/wzeion/devboard
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