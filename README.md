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
- [x] Tasks CRUD (create, read, update, delete)
- [x] Kanban board columns (To Do, In Progress, Done)
- [x] Priority levels (Low, Medium, High)
- [x] Due dates on tasks
- [x] Activity logging on task actions
- [ ] Drag and drop Kanban
- [ ] Dashboard with stats
- [ ] Dark mode + filters

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