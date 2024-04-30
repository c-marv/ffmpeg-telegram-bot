FROM node:18-alpine as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN apk update
RUN apk add
RUN apk add ffmpeg
RUN yarn install --production --frozen-lockfile
COPY --chown=node:node --from=builder /usr/src/app/build ./build
USER node
EXPOSE 3000
VOLUME /usr/src/app/tmp
CMD ["node", "build/index.js"]
