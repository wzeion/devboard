# DevBoard

A full-stack developer task and project tracking tool built with Next.js, PostgreSQL, and Prisma.

## 🚧 Status
Under active development.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon)
- Prisma ORM
- NextAuth.js

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/wzeion/devboard
cd devboard
npm install
```

Add your `.env` file (see `.env.example`), then:

```bash
npx prisma db push
npm run dev
```

## Features (In Progress)
- [ ] Authentication (Email + Google OAuth)
- [ ] Project management
- [ ] Kanban board with drag and drop
- [ ] Activity logging
- [ ] Dashboard with stats