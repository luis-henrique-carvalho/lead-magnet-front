# syntax=docker/dockerfile:1.7

# Dockerfile - Frontend React + Vite

ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base

WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN npm install -g pnpm@10.18.3 --quiet

FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/pnpm/store \
  pnpm install --frozen-lockfile --ignore-scripts && \
  pnpm rebuild esbuild '@clerk/shared'

FROM base AS dev

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN addgroup -S app && adduser -S app -G app \
  && chown -R app:app /app

USER app

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
