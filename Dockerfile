# ---------------------------------------------------
# STAGE 1: Dependency Installation & Build
# ---------------------------------------------------
# Use Node 24 to match local development environment
FROM node:24-alpine AS builder

# Optimized for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy dependency definitions
COPY package.json pnpm-lock.yaml ./

# Install dependencies (frozen-lockfile for consistency)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code including knexfile config
COPY . .

# Build application (NestJS -> dist/)
# NOTE: Ensure migrations are compiled to JS if using TypeScript migrations
RUN pnpm run build

# Prune dependencies - Remove devDependencies for production
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm prune --prod

# ---------------------------------------------------
# STAGE 2: Production Runtime
# ---------------------------------------------------
FROM node:24-alpine AS runner

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Production Knex Config (Keep .cjs extension for CommonJS support in ESM project)
COPY --from=builder /app/knexfile.production.cjs ./knexfile.cjs

# Expose port (Render listens on $PORT, default 3000)
ENV PORT=3000
EXPOSE 3000

# Start command: Run migrations then start app
# Using npm run migrate:prod saves us from needing npx/global knex
CMD ["sh", "-c", "npm run migrate:prod && node dist/main"]
