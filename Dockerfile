FROM node:lts AS builder

WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install && pnpm rebuild
COPY . .
RUN cp .env.example .env
RUN pnpm prisma migrate deploy && pnpm prisma generate && pnpm build
RUN pnpm pkg delete scripts.prepare
RUN pnpm prune --prod

FROM node:lts

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

ENTRYPOINT [ "node", "build" ]
