# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Jumo is a nutrition and health app monorepo built with Turborepo. The stack includes:

- **Mobile**: Expo/React Native app with Expo Router
- **API**: Express.js backend with JWT authentication
- **Supabase**: Local Supabase instance for database and auth
- **Shared packages**: TypeScript configs, ESLint configs, Jest presets, logger, UI components, and shared type definitions

## Commands

### Root Level

- `npm install` - Install all dependencies
- `turbo run dev` - Run all apps in development mode
- `turbo run build` - Build all apps and packages
- `turbo run lint` - Lint all packages
- `turbo run test` - Run tests across all packages
- `npm run clean:all` - Remove all build artifacts (.next, .turbo, node_modules, .expo, \*.tsbuildinfo)

### API (`apps/api`)

- `npm run dev` - Start API dev server with hot reload (runs on port 3001 with debugger on 9229)
- `npm run build` - Build TypeScript to dist/
- `npm run start` - Start production server
- `npm run test` - Run Jest tests with ESM support
- `npm run lint` - Type check and lint

**Important**: API uses ESM modules (type: "module"), so all imports must use `.js` extensions even for `.ts` files.

### Mobile (`apps/mobile`)

- `npm run start` - Start Expo dev server with development variant
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run prebuild` - Generate native projects

### Supabase (`apps/supabase`)

- `npm run start` - Start local Supabase instance
- `npm run stop` - Stop local Supabase instance
- `supabase gen signing-key` - Generate signing keys (save to supabase/signing_keys.json)
- `supabase gen bearer-jwt --role service_role --payload "{\"iss\": \"http://127.0.0.1:54321/auth/v1\", \"aud\": \"authenticated\"}" --valid-for "5256000m"` - Generate local dev JWT token

### Shared Packages (`packages/*`)

- `npm run build` - Build package
- `npm run dev` - Watch mode for development
- `npm run test` - Run package tests

## Architecture

### Authentication Flow

- Mobile app uses Supabase client for authentication (Google Sign-In, Apple Auth)
- API uses express-jwt middleware with JWKS validation
- JWT tokens are verified against AUTH_DOMAIN/.well-known/jwks.json
- Protected routes require valid JWT tokens with matching audience/issuer

### API Structure

- **Middleware**: Auth (JWT), error handling, file uploads, correlation IDs
- **Controllers**: Organized under `/api/` routes
  - `/ai/chat` - AI chat streaming with OpenAI (nutrition advice)
  - `/ai/upload-photo` - Image analysis for nutrition estimation (HEIC support)
  - `/foods/*` - Food search and barcode lookup (OpenFoodFacts, FDC USDA)
- **Services**: All business logic is organised inside `/services/<service-name>/**`
- **Database**: Direct postgres connection using `postgres` library, not through Supabase SDK
- **Process Lifecycle**: Graceful shutdown handlers for cleanup

### Mobile Structure

- **Routing**: File-based routing with Expo Router
  - `app/(tabs)/*` - Tab navigation (iOS has custom iOS tab bar)
  - `app/(stacks)/*` - Stack navigation (camera, chat)
  - `app/login.tsx` - Auth screen
- **Authentication**: Supabase client with AsyncStorage persistence and auto-refresh
- **Components**: All generic components are organised inside `/components/**`
- **Screens**: All screens are organized inside the `/screens/**` There should be no code inside the routing folder `app/**`. All sub components are then organised in subfolders for e.g. `/screens/<screen-name>/components/**`

### Environment Variables

**API** (apps/api/.env.development.local):

```
NODE_ENV=development
AUTH_AUDIENCE=<jwt-audience>
AUTH_DOMAIN=<supabase-url>
AUTH_JWT_SECRET=<secret>
DB_HOSTNAME=db
DB_PORT=5432
DB_NAME=<db>
DB_USERNAME=<user>
DB_PASSWORD=<pass>
```

**Mobile** (apps/mobile/.env.development.local):

```
EXPO_PUBLIC_SUPABSE_URL=<supabase-url>
EXPO_PUBLIC_SUPABSE_ANONYMOUS_KEY=<anon-key>
```

### Database Connection

- API connects directly to Postgres using the `postgres` library
- Connection configured via DB\_\* environment variables
- SSL disabled for development/test, required for production
- Graceful shutdown ensures connection termination

### Database Migrations

- Managed via supabase CLI and the supabase package in `packages/supabase`

### AI Features

- Chat uses OpenAI GPT-4 Turbo with streaming responses
- Image upload converts HEIC to JPEG, resizes to 256px, and uses GPT-4.1-mini for nutrition analysis
- AI persona: "Jumo" - professional nutritionist providing health advice

### Monorepo Structure

- Turborepo manages build dependencies (packages build before apps)
- Shared configs in packages: TypeScript, ESLint, Jest
- Logger package provides winston-based logging with correlation IDs and HTTP logging
- Interfaces package (`@jumo-monorepo/interfaces`) provides shared TypeScript type definitions for domain models and API contracts, used across all apps for type safety
- Internal packages use `*` version for local dependencies

## Key Technical Notes

- **Node version**: Managed by Volta (22.20.0)
- **Package manager**: npm 11.6.1
- **TypeScript**: All code is TypeScript
- **Testing**: Jest with ESM support, uses ts-jest
- **API Inspector**: Development server runs with --inspect flag on 0.0.0.0:9229
- **Timezone**: API runs with TZ=UTC
- **CORS**: Configured for localhost and Vercel preview domains in non-production

## Coding instructions

- Avoid unnecessary descriptive comments. Variable and function names should be self-explanatory.
