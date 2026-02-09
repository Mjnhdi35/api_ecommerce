# Database Setup Guide 🐘

This project uses **PostgreSQL 17** (via Docker) and **Knex.js** for database management.

## 🚀 Quick Start

### 1. Start Database
```bash
# Start PostgreSQL container
pnpm docker:up

# Check status
pnpm docker:ps

# View logs
pnpm docker:logs
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` matches your Docker configuration.

### 3. Migrations
Run migrations to setup database schema:
```bash
# Run latest migrations
pnpm migrate:latest

# Rollback last batch
pnpm migrate:rollback

# Create new migration
pnpm migrate:make migration_name
```

### 4. Seeds (Optional)
Run seeds to populate initial data:
```bash
# Run seeds
pnpm seed:run

# Create new seed
pnpm seed:make seed_name
```

## 🛠️ Docker Commands
- `pnpm docker:up`: Start database in background.
- `pnpm docker:down`: Stop database.
- `pnpm docker:reset`: Reset database (stop, remove volumes, start).

## 📦 Knex Configuration
- Config file: `knexfile.ts` (ESM native)
- Migrations folder: `src/database/migrations`
- Seeds folder: `src/database/seeds`

## 🔍 Database Connection
The `DatabaseModule` (Global) provides the Knex instance via `KNEX_CONNECTION` token.

```typescript
import { Inject, Injectable } from '@nestjs/common';
import type { Knex } from 'knex'; // Use 'import type' for ESM
import { KNEX_CONNECTION } from './database/database.module.js';

@Injectable()
export class UserService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}
  
  async findAll() {
    return this.knex('users').select('*');
  }
}
```
