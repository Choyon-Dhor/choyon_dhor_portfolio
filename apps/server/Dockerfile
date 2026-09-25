FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/server/package.json apps/server/package.json
COPY apps/client/package.json apps/client/package.json
RUN npm install
COPY apps/server apps/server
RUN npm run build -w apps/server

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/server/package.json apps/server/package.json
COPY apps/client/package.json apps/client/package.json
RUN npm install --omit=dev -w apps/server && npm cache clean --force
COPY --from=build /app/apps/server/dist apps/server/dist
RUN mkdir -p apps/server/uploads
EXPOSE 5000
CMD ["node", "apps/server/dist/server.js"]
