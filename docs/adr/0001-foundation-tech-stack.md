# ADR 0001: Foundation technology stack

## Date

2026-06-28

## Context

I'm building Practice incrementally—not trying to ship a full product on day one. The first milestone just needs to work: sign-in, somewhere to store data, and enough structure that scheduling, notes, billing, and background jobs can land later without a rewrite.

I'm documenting decisions like this as I go. Not because I think I've picked the "correct" stack, but because I want to practice explaining trade-offs the way I'd talk through them in an interview or code review.

At this stage I needed:

- A browser-based app I could ship quickly, without standing up a bunch of separate services
- Auth that works without me building it from scratch
- Relational data with migrations and types (therapists, patients, and whatever comes next)
- A local setup that doesn't fight me every time I sit down to work
- Room to figure out later which things should be sync vs. async, and how the system should grow

One product decision came up early and is shaping the build: **this app is for therapists, not patients.**

My sister's a therapist, and the pain points I've heard about are mostly on *her* side—scheduling, notes, billing, keeping track of clients. Patients need to exist in the system as people she works with, but they don't need accounts or a logged-in experience in v1. That distinction mattered more than I expected when I started thinking about auth.

## Decision

I'm going with a **monolithic Next.js app**, **PostgreSQL**, **Clerk** for auth, and **Prisma** as the ORM.

| Layer | Choice | What it's doing |
| --- | --- | --- |
| App | Next.js 16 (App Router) | UI + server logic in one place |
| Auth | Clerk | Sign-in, sessions, middleware |
| Database | PostgreSQL 17 | Source of truth |
| ORM | Prisma 7 | Schema, migrations, typed queries |
| Local DB | Docker Compose | Postgres for dev |
| UI | React 19, Tailwind, shadcn/ui | Components and styling |

A few smaller decisions that go with this:

**Only therapists are users.** If you can sign in via Clerk, you're a therapist. The app keeps a `Therapist` row keyed by `clerkId`. Patients are just records the therapist owns—name, email, phone. No `clerkId` on `Patient`, no Clerk account for clients. The DB is basically a CRM for caseload management.

**Lazy therapist provisioning, no webhook (for now).** When someone signs in and hits a protected route, `getCurrentTherapist()` looks them up by `clerkId` and creates a row if one doesn't exist yet. I looked at Clerk's `user.created` webhook—the standard production pattern—but for where I am now, the in-app approach is simpler. No ngrok, no signing secrets, no worrying about missed deliveries during local dev. I can add the webhook later without changing the data model.

**Prisma schema split across files.** Models live in `prisma/therapist.prisma`, `prisma/patient.prisma`, etc., with shared config in `schema.prisma`. Mostly so the schema doesn't turn into one giant file as the domain grows.

**Generated client lives in the repo.** Prisma Client outputs to `src/generated/prisma` instead of `node_modules`. Makes imports explicit and easier to reason about.

**Prisma 7 + pg driver adapter.** Singleton client in `src/db/prisma.ts` using `@prisma/adapter-pg`. That's what Prisma 7 expects for a direct Postgres connection.

**Everything scoped to a therapist.** Patients belong to one therapist via foreign key. I'm assuming future domain data follows the same boundary unless a later ADR says otherwise.

**Portal links for patient-facing stuff (later, not now).** When a patient needs to book a slot or fill out a form, I'd rather send them a signed, time-limited link than make them create an account. The platform isn't built for patients— but that doesn't mean they can never interact with it at all.

## Alternatives I considered

**Separate frontend and backend (React SPA + REST/GraphQL API).**
More moving parts for a solo project at v0. Next.js lets me colocate UI and server logic, which fits how I'm building this incrementally. I'd revisit if I needed a standalone API for mobile or integrations.

**Rolling my own auth (NextAuth, custom JWT, Cognito).**
I don't want to spend weeks on login flows and session edge cases. Clerk is a vendor dependency and costs money at scale, but it gets me past auth quickly. The `Therapist` model also gives me an escape hatch if I ever need to move off Clerk.

**SQLite for local dev.**
Easier setup, but behavior diverges from production Postgres. I'd rather match prod from the start—constraints, migrations, query patterns.

**Supabase or Firebase as the whole backend.**
Would speed up early CRUD, but I'd be coupled to their patterns. I care about owning the schema, especially for things like billing and audit trails down the road.

**One `User` table with roles (`THERAPIST | PATIENT`).**
Both personas sign in through Clerk, one identity model, role checks everywhere. I decided against this because I'm not building a patient app right now. Separate UX paths, patient onboarding, role guards—all that complexity before there's even a patient experience to build. If I need patient login later, I can add a nullable `Patient.clerkId` without redesigning everything.

**Clerk webhook to sync therapists at sign-up.**
Clerk POSTs `user.created`, app creates the `Therapist` row before the user hits the dashboard. Cleaner separation, but more setup for where I am today. Keeping it in mind for later.

**Patient accounts from day one.**
Some practice-management tools give every client a login. I'm not doing that. Most of the value in v1 is on the therapist side, and scheduling/intake can probably happen through portal links. Also keeps Clerk MAU from growing with people who aren't really "users" of the platform.

## Consequences

**What's working in my favor:**

- One repo, one deployable thing. Less overhead while I'm learning to own a system end to end.
- Auth works in hours, not weeks.
- Prisma catches schema drift early and gives me types for free.
- `Therapist` decouples my domain IDs from Clerk—useful if auth ever changes.
- Patients-as-records matches how I actually think about the product. Permissions are simple: you're a therapist, you see your patients.
- No patient auth means no password resets or MFA flows for people who were never supposed to log in anyway.
- Portal links (when I get there) should cover scheduling without bloating the identity model.
- Docker Compose means Postgres 17 locally, same as prod-ish.

**What I'm giving up or deferring:**

- UI and server logic are coupled in Next.js. Extracting a standalone API later would take deliberate work.
- Clerk is an external dependency—I don't control their uptime or pricing.
- First authenticated request after sign-up does a DB write to create the therapist row. Fine at my scale; unique index + race handling if two requests hit at once.
- Patients can't self-serve until portal links exist.
- Portal links mean I own token security, expiry, and revocation. Future problem.
- I don't know yet where the monolith stops scaling. Not splitting into microservices prematurely either.

**Things to revisit:**

- Sync vs. background jobs when scheduling and notifications show up (probably its own ADR).
- Portal-link design (`patientId`, purpose, expiry) when patient scheduling is in scope.
- Clerk webhook if lazy upsert becomes annoying or I need data pre-provisioned at sign-up.
- Auth and deployment topology before this handles real PHI or lots of concurrent therapists.
- The README "Current architecture" section—fill that in as milestones land.
