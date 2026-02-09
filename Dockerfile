FROM node:24-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm prune --prod

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/knexfile.production.cjs ./knexfile.cjs

ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npm run migrate:prod && node dist/src/main"]
