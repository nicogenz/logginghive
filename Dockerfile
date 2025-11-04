FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run db:generate && npm run build

FROM node:alpine AS production
WORKDIR /usr/src/app
COPY --from=BUILD /usr/src/app/package*.json ./
COPY --from=BUILD /usr/src/app/node_modules ./node_modules
COPY --from=BUILD /usr/src/app/.output ./.output
COPY --from=BUILD /usr/src/app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
