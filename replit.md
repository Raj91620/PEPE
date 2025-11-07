# Overview

CashWatch is a React-based web application enabling users to earn cryptocurrency by engaging with advertisements. It offers a gamified experience with features like daily streaks, a multi-level referral program, and cryptocurrency withdrawal functionalities. The platform aims to provide an engaging and user-friendly method for cryptocurrency earning, built on a modern full-stack architecture with dynamically configurable settings via an admin dashboard. The business vision is to create a widely adopted and accessible platform for micro-earnings in cryptocurrency, tapping into the growing digital economy.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
*   **Frameworks**: React with TypeScript, Vite.
*   **Routing**: Wouter.
*   **State Management**: TanStack Query.
*   **UI/UX**: Utilizes shadcn/ui, Radix UI, Tailwind CSS, custom CSS for theming (light/dark mode), and Framer Motion for animations. The design features a diamond theme with a cyan and silver palette, frosted glass cards, glow effects, and sparkle animations. Navigation includes a curved bottom bar and a top-left hamburger menu with Lucide React icons.
*   **Forms**: React Hook Form with Zod validation.
*   **Anti-Cheat**: Implemented a 3-second minimum ad watch time.
*   **Key Features**: Dedicated pages for wallet activity (transaction history), and monthly leaderboards for earners and referrers.

## Backend
*   **Runtime**: Node.js with Express.js.
*   **Database ORM**: Drizzle ORM with PostgreSQL.
*   **API**: RESTful API with JSON responses.
*   **Session Management**: Express sessions with PostgreSQL store.
*   **Telegram Bot**: Integrated for admin controls, broadcasts, and user notifications.
*   **Security**: Parameterized queries and device tracking for multi-account prevention.

## Authentication & Authorization
*   **Provider**: Replit OAuth (OpenID Connect).
*   **Session Strategy**: Server-side sessions with secure HTTP-only cookies.
*   **Authorization**: Middleware-based route protection.
*   **User Management**: Automatic user creation/updates, device ID-based multi-account prevention. Admin access is dynamically determined by environment variables (`ADMIN_ID` or `TELEGRAM_ADMIN_ID`).

## Data Storage
*   **Primary Database**: PostgreSQL.
*   **Schema Management**: Drizzle migrations.
*   **Key Entities**: Users (balance, streaks, referrals), Earnings, Withdrawals, Referral relationships, Sessions, Advertiser Tasks, Task Clicks.

## Business Logic
*   **Ad Watching System**: Users earn MGB per ad with cooldowns and minimum watch time. Rewards are dynamically configured via admin settings.
*   **Gamification**: Includes a Spin & Win system and Daily Streak rewards.
*   **Referral Program**: Multi-level commission on referred users' ad earnings.
   - Users can apply referral codes via both Telegram bot (`/start REFCODE`) and web app (`POST /api/referrals/apply`)
   - When a new user signs up with a referral code, the referrer's `friendsInvited` count is instantly incremented
   - Real-time WebSocket notifications update referral counts and commission earnings without page reload
   - Referrers earn 10% commission on their referred users' ad watching earnings (stored as pending bonus)
   - Commission system prevents self-referrals through device ID matching and same-user detection
*   **Withdrawal System**: MGB-based withdrawals (1 TON = 5,000,000 MGB internally), requiring a minimum number of friend invites and admin approval. TON wallet address validation is performed (UQ/EQ prefix, 48 characters).
*   **Currency System**: Earnings and tasks are displayed as PAD (1 TON = 100,000 PAD internally). Withdrawals are processed in MGB. Internal database storage uses TON for precision, with automatic conversion to/from MGB in the UI. All task types now provide a fixed reward of 200 MGB.
*   **Admin Controls**: Comprehensive settings for affiliate commission, wallet change fees, minimum withdrawal, task rewards, task creation cost, balance conversion, and broadcast functionality.
*   **Task System**: Users can create tasks (e.g., join Telegram channels) with strict Telegram link validation. Channel verification logic has been removed; tasks are auto-verified upon completion.

# External Dependencies

## Core Infrastructure
*   **Database**: Neon PostgreSQL serverless.
*   **Authentication**: Replit OAuth/OIDC.
*   **Session Storage**: `connect-pg-simple`.
*   **Telegram Bot API**: `node-telegram-bot-api`.

## Frontend Libraries
*   **UI**: Radix UI, Tailwind CSS.
*   **State Management**: TanStack Query.
*   **Form Management**: React Hook Form, Zod.
*   **Date Handling**: `date-fns`.
*   **Animations**: Framer Motion.

## Ad Integration
*   **Ad Provider**: External advertisement service integrated via the global window object.