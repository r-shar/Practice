# Practice

## Why I'm building this

My sister is a therapist, and over the years I've heard a lot about what happens outside of the therapy session itself.

Scheduling clients. Writing notes. Billing insurance. Keeping track of treatment plans. Following up with clients. None of these tasks are especially complicated on their own, but they're spread across different tools and require a surprising amount of manual work.

Listening to those pain points made me curious: if I were designing this system from scratch today, what would it look like?

This project is my attempt to answer that question.

I'm also using it as an opportunity to practice building and owning a software system end to end—from product decisions and system design to implementation, deployment, and operations.

## What I'm hoping to learn

Rather than cloning an existing product feature-for-feature, I'm treating this as a playground for engineering decisions.

As I build, I'll be exploring questions like:

* Which workflows should happen synchronously, and which belong in background jobs?
* How should different parts of the system communicate?
* What happens when third-party services fail?
* How should data be modeled so the system can grow over time?
* What would need to change if this supported one therapist? One hundred? One thousand?

Every major decision is documented in this repository—not because I think it's the "correct" answer, but because I want to practice making thoughtful trade-offs.

## Current architecture

Monolithic Next.js app with PostgreSQL and Clerk. See [ADR 0001](docs/adr/0001-foundation-tech-stack.md) for stack decisions.

```
src/
├── app/                 # Routes and layouts (App Router)
│   └── (dashboard)/     # Auth-protected pages (route group, no URL prefix)
├── components/
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── auth.ts          # Clerk session → Therapist record
│   ├── db.ts            # Prisma client singleton
│   └── utils.ts         # Shared helpers
└── proxy.ts             # Clerk middleware (Next.js 16)

prisma/                  # Schema (split by domain) and migrations
docker/                  # Local Postgres for development
```

**Naming:** `Client` in the database and code, `/clients` in routes — same term everywhere.

## Roadmap

This project is being built incrementally.

Each milestone focuses on a specific engineering concept, from authentication and scheduling to event-driven workflows, observability, AI-assisted note generation, and billing.

The goal isn't to recreate an existing product feature-for-feature.

The goal is to become a better systems engineer by building something meaningful end to end.
