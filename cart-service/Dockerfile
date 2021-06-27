FROM node:lts as build
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build && npm prune --production && /usr/local/bin/node-prune


FROM alpine:latest
RUN apk add --update --no-cache nodejs
WORKDIR /app
ENV NODE_ENV production
COPY --from=build app/dist ./
COPY --from=build app/node_modules ./node_modules/
EXPOSE 4000
CMD ["node", "main.js"]
